# Send Signal – Engineering & Product Skills Guide

This document defines the baseline engineering, product, and system design standards for Send Signal.

All implementations must adhere to these rules to ensure scalability, reliability, compliance, and maintainability. This is a living document — every agent and engineer working on Send Signal must internalize and apply these standards without exception.

---

## 1. Code Organization

Code must be modular, readable, and scalable. Every module must be independently understandable and deployable without knowledge of other modules.

### Principles
- Avoid large monolithic files — split by responsibility, not convenience
- Group features by **domain**, not by type (no `/controllers`, `/models` top-level folders)
- Each module owns its full vertical slice: handler → service → model → validation
- Shared utilities go in `/shared` or `/common` — never duplicated across modules
- No circular dependencies between modules

### Core Modules
```
/leads
/templates
/campaigns
/messaging
/analytics
/auth
/settings
/integrations
/shared
```

### Each Module Must Contain
```
/<module>
  ├── <module>.controller.ts     → HTTP handlers / route definitions
  ├── <module>.service.ts        → Business logic
  ├── <module>.model.ts          → DB schema / ORM model
  ├── <module>.validation.ts     → Input validation schemas (Zod/Joi)
  ├── <module>.types.ts          → TypeScript types and interfaces
  ├── <module>.test.ts           → Unit + integration tests
  └── index.ts                   → Public exports
```

### File Size Rule
- No file should exceed ~300 lines
- If it does, split by sub-responsibility (e.g., `campaign-scheduler.service.ts`, `campaign-executor.service.ts`)

---

## 2. Naming Conventions

Consistency is mandatory across the entire codebase.

| Context | Convention | Example |
|---|---|---|
| Files | kebab-case | `lead-service.ts` |
| React Components | PascalCase | `CampaignBuilder` |
| Functions | camelCase | `sendCampaignMessages` |
| Variables | camelCase | `leadList` |
| Constants | UPPER_SNAKE_CASE | `MAX_BATCH_SIZE` |
| Database tables | snake_case | `message_logs` |
| Database columns | snake_case | `created_at`, `opt_in` |
| API endpoints | kebab-case | `/api/campaigns/:id/send` |
| Environment variables | UPPER_SNAKE_CASE | `WHATSAPP_API_TOKEN` |
| CSS classes (custom) | kebab-case | `campaign-status-badge` |

### Naming Rules
- Names must reflect **intent**, not implementation (`getEligibleLeads` not `getFilteredArray`)
- Avoid abbreviations unless universally understood (`id`, `url`, `csv` are fine; `lst`, `proc` are not)
- Boolean variables must read as questions: `isUnsubscribed`, `hasOptedIn`, `canSendMessage`
- Event handlers: prefix with `handle` (`handleCampaignSubmit`, `handleLeadImport`)

---

## 3. Data Validation & Integrity

All external input is untrusted. Validation must happen at the server boundary — always.

### Core Rules
- Validate **ALL** inputs on the server, every time
- Never rely solely on frontend validation
- Sanitize inputs before persistence (strip whitespace, normalize formats)
- Return structured, descriptive error messages — never expose raw DB or stack errors to clients

### Required Validations by Domain

**Leads**
- `phone_number`: Required, normalized to E.164 format (`+2348012345678`)
- `email`: Valid email format if provided
- `opt_in`: Must be a boolean — default `false` if not provided
- CSV imports: Validate file structure, column presence, and row-level data before ingestion
- Reject import batch entirely if critical column (phone) is missing

**Templates**
- Placeholder syntax must be valid (`{FirstName}`, not `{First Name}` or `{firstname}`)
- All placeholders referenced in template body must exist in the available field set
- Template must not be empty
- WhatsApp approval status must be `approved` before template can be used in a live campaign

**Campaigns**
- Audience selection must yield at least 1 eligible lead
- Template must be in `approved` state
- Scheduled send time must be in the future
- Batch size and delay must be within allowed ranges (respect WhatsApp throughput)
- Opt-in confirmation must be explicitly acknowledged before execution

**Messages**
- `lead_id` and `campaign_id` must both exist and belong to the same user account
- Message must not already exist for `(lead_id, campaign_id)` — idempotency check

### Idempotency (Critical)
Messaging must be idempotent at all times:
- Database unique constraint on `(lead_id, campaign_id)` in the `messages` table
- Before dispatching, check existence — do not re-send if record exists
- Idempotency must hold across: manual retries, queue re-processing, system crashes, and re-triggered campaigns

---

## 4. Messaging System Rules (Critical — Never Violate)

Send Signal is fundamentally a messaging platform. Strict discipline here is non-negotiable.

### Server-Side Only
- **ALL WhatsApp API calls must originate exclusively from the backend**
- **API credentials must never be accessible from or passed to the frontend under any circumstance**
- The frontend interacts with Send Signal's own backend API only
- Backend validates, queues, and dispatches — frontend only reflects state

### Queue-Based Execution (Mandatory)
- Every campaign send must go through a job queue (e.g., BullMQ + Redis)
- No direct synchronous bulk sending — ever
- Queue must support:
  - **Batching** — configurable messages per batch
  - **Delay intervals** — configurable pause between batches
  - **Retries** — exponential backoff on failure
  - **Concurrency control** — limit simultaneous workers
  - **Persistence** — queue survives server restarts

### Queue Job Structure
Each queued job must contain:
```json
{
  "campaign_id": "uuid",
  "lead_id": "uuid",
  "template_id": "uuid",
  "resolved_message": "Hi Jane, thanks for signing up via TikTok!",
  "whatsapp_account_id": "uuid",
  "attempt": 1,
  "scheduled_at": "ISO8601"
}
```

### Rate Limiting
- Respect WhatsApp's tiered throughput limits (varies by quality rating and tier)
- Default safe rate: do not exceed 20 messages/second without confirmed higher tier
- Implement token bucket or sliding window rate limiter at queue worker level
- Log rate limit hits — do not silently drop messages

### Failure Handling
Every failed message must:
- Be logged with: `campaign_id`, `lead_id`, `attempt_number`, `failure_reason`, `timestamp`
- Trigger retry with exponential backoff (e.g., 1s → 5s → 30s → give up after 3 attempts)
- After max retries: mark message status as `Failed`, surface reason to user in Campaign detail
- Never silently fail — every failure must be visible and auditable

### Campaign Runtime Controls
Users must be able to at any point during a live campaign:
- **Pause** — stop dispatching new messages, retain queue state
- **Resume** — continue from where paused
- **Stop / Cancel** — drain queue, mark remaining as `Cancelled`, log final counts
- **Monitor** — see real-time progress (sent / total, failures, estimated completion time)

---

## 5. Compliance Enforcement (Non-Negotiable)

Compliance is a system responsibility — not a user responsibility. The platform must enforce it automatically.

### Opt-In Enforcement
- Messages can **only** be sent to leads where `opt_in = true`
- System must filter out non-opted-in leads at campaign execution time, not just at UI level
- Before campaign executes: show user count of excluded leads due to missing opt-in
- Log explicit opt-in confirmation acknowledgment per campaign (timestamp + user_id)

### Unsubscribe Detection & Enforcement
Detect the following keywords in **all incoming WhatsApp messages** (case-insensitive, trim whitespace):

```
STOP | UNSUBSCRIBE | CANCEL | END | QUIT
```

On detection:
1. Immediately set `unsubscribed = true` on the lead record
2. Update lead status → `Unsubscribed`
3. Log unsubscribe event with timestamp in `analytics_events`
4. Remove lead from any active campaign queues
5. Block lead from being included in any future campaign audience query
6. Re-engagement only permitted after explicit re-opt-in flow is completed

### Template Compliance
- Only WhatsApp-approved templates (`approval_status = 'approved'`) may be used in live campaigns
- Dynamic placeholder substitution must not modify the template's approved structure
- Placeholder-only substitution is permitted — adding, removing, or restructuring text is not
- Template approval status must be re-verified if template content is edited

### Data Compliance (GDPR & Privacy)
- Encrypt at rest: `whatsapp_api_token`, `api_keys`, user passwords (hashed), and phone numbers where regulation requires
- All data in transit: HTTPS/TLS only — no exceptions
- Support right-to-deletion: provide data erasure endpoint for lead records
- Log all consent events (opt-in, unsubscribe) with timestamps for regulatory audit trail
- EU user data must be handled with GDPR obligations in mind (data processing agreements at Enterprise tier)

---

## 6. Database & Data Consistency

### Structural Requirements
- Use relational structure (PostgreSQL) for all core data
- Enforce foreign key relationships — no orphaned records permitted
- Use transactions for any multi-table write operations (e.g., creating a campaign + scheduling jobs)
- Prefer soft deletes (`deleted_at` timestamp) over hard deletes to preserve audit history

### Core Tables & Key Constraints

| Table | Key Constraints |
|---|---|
| `users` | Unique email; hashed password |
| `whatsapp_accounts` | FK → users; encrypted token fields |
| `leads` | Unique phone per user account; index on `source`, `opt_in`, `unsubscribed`, `status` |
| `templates` | FK → users; index on `approval_status` |
| `campaigns` | FK → users, templates; index on `status`, `scheduled_at` |
| `messages` | Unique `(lead_id, campaign_id)`; FK → leads, campaigns; index on `status` |
| `analytics_events` | FK → leads, campaigns, messages; index on `event_type`, `created_at` |

### Query Rules
- Every table used in list views must have indexes on filterable/sortable columns
- Paginate all list queries — never return unbounded result sets
- Use `SELECT` with explicit column lists — never `SELECT *` in production queries
- Avoid N+1 queries — use joins or eager loading appropriately
- Long-running reports must use background jobs, not synchronous HTTP requests

### Data Integrity Rules
- No nullable foreign keys without documented justification
- Enum fields (status, source, etc.) must be validated at both application and DB constraint level
- `created_at` and `updated_at` on every table — auto-managed
- Message logs must never be hard-deleted (regulatory and debugging requirement)

---

## 7. User Interface Rules

UI must be consistent, accessible, and token-driven. Design system compliance is mandatory.

### Design System Enforcement
- `design-tokens.tokens.json` is the single source of truth for all visual decisions
- **Colors** → `tokens.css` CSS variables only — never raw hex, RGB, or Tailwind color utilities
- **Typography** → `tokens.css` only — no arbitrary font sizes or weights
- **Spacing / layout** → Tailwind spacing utilities are permitted
- **Shadows, borders, radii** → tokens only

### Absolute UI Rules
- ❌ No direct hex color values in any component
- ❌ No arbitrary font sizes (`text-[13px]` is forbidden)
- ❌ No inline styles unless technically unavoidable (and must be documented)
- ❌ No hardcoded spacing values outside of Tailwind scale
- ✅ All interactive elements must have visible focus states (accessibility)
- ✅ All form inputs must have associated labels
- ✅ Color alone must never be the sole indicator of state (use icons or text alongside)

### UX Expectations
- **Loading states**: Every async operation must show a loading indicator
- **Success feedback**: Confirm successful actions (toast, inline message, or state change)
- **Error feedback**: Show actionable, human-readable error messages — never raw error codes
- **Empty states**: Every list view must have a meaningful empty state with a call to action
- **Previews**: Templates and campaigns must show real-data previews before execution
- **Impact visibility**: Always show consequence of an action before it's taken (recipient count, estimated duration)
- **Destructive actions**: Require explicit confirmation (modal with description of what will happen)

### Component Standards
- Components must be single-responsibility
- Props must be typed (TypeScript interfaces)
- No business logic inside UI components — delegate to hooks or services
- Reusable components go in `/shared/components`

---

## 8. Campaign Safety & Controls

Sending messages at scale carries real risk. Safeguards are mandatory, not optional.

### Pre-Send Mandatory Checks (All Must Pass Before Dispatch)
1. ✅ At least 1 eligible lead in audience (opted-in, not unsubscribed)
2. ✅ Template is WhatsApp-approved
3. ✅ Opt-in confirmation acknowledged by user
4. ✅ No duplicate campaign already running for same audience + template
5. ✅ Scheduled time is valid (future, within allowed window)
6. ✅ WhatsApp account is connected and active

### Confirmation Screen (Mandatory Before Any Send)
Must display:
- Total recipient count
- Count excluded due to unsubscribe or missing opt-in
- Template name and preview (with real data substitution from first lead)
- Send mode (immediate or scheduled time)
- Estimated send duration based on batch size and delay config
- Explicit "I confirm these leads have consented to receive WhatsApp messages" checkbox

### Runtime Controls
| Control | Behavior |
|---|---|
| Pause | Stop dispatching new queue jobs; retain state |
| Resume | Re-activate queue from paused state |
| Stop | Drain remaining queue; mark unsent as `Cancelled`; log final counts |
| Monitor | Real-time progress bar (sent/total), failure count, ETA |

---

## 9. Analytics & Observability

The system must be measurable, debuggable, and transparent to both users and engineers.

### User-Facing Campaign Metrics (Required)
| Metric | Formula |
|---|---|
| Delivery rate | Delivered / Sent |
| Read rate | Read / Delivered |
| Reply rate | Replied / Delivered |
| Conversion rate | Converted / Targeted |
| Failure rate | Failed / Sent |
| Opt-out rate | Unsubscribed / Delivered |

### Platform-Level Metrics (Internal Monitoring)
- DAU / MAU
- Campaigns sent per user per month
- Onboarding completion rate (sign-up → first campaign dispatched)
- Free-to-paid conversion rate
- Monthly churn rate
- Message queue depth and processing latency
- System uptime (target: 99.9%+)
- WhatsApp API error rates by type

### Event Logging Requirements
Every message event must be logged to `analytics_events` with:
- `event_type` (queued, sent, delivered, read, replied, failed, unsubscribed, converted)
- `lead_id`
- `campaign_id`
- `message_id`
- `timestamp`
- `metadata` (failure reason, retry attempt, etc. where applicable)

### Engineering Observability
- All errors must include: `campaign_id`, `lead_id`, `error_code`, `error_message`, `stack_trace` (server-side only), `timestamp`
- Use structured logging (JSON format) — never plain string logs in production
- Alert thresholds: failure rate > 5% on any campaign should trigger an internal alert
- Queue health metrics (depth, processing rate, dead-letter count) must be monitored

---

## 10. Performance & Scalability

The system must handle growth from 50 leads to 50,000+ leads without architectural changes.

### Rules
- All messaging operations must be **async** — no blocking synchronous sends
- Paginate every list endpoint — default page size: 50, max: 200
- All filterable/sortable columns must be indexed in the database
- Cache frequently read, rarely changing data (templates, user settings) with Redis — TTL required
- Background jobs for: CSV import processing, campaign execution, analytics aggregation, report generation

### Performance Targets
| Operation | Target |
|---|---|
| Page load (dashboard) | < 2 seconds |
| Lead import (1,000 rows CSV) | < 10 seconds |
| Campaign creation (UI) | < 3 seconds |
| Message dispatch throughput | ≥ 20 messages/second (default tier) |
| API response time (p95) | < 500ms |
| System uptime | ≥ 99.9% |

### Scalability Patterns
- Queue workers must be horizontally scalable (multiple workers, same queue)
- Database connection pooling required (PgBouncer or equivalent)
- Avoid long-running transactions — keep transactions short and scoped
- Large campaign sends must never block other users' operations (queue isolation per account if needed)

---

## 11. Security Standards

### Data Protection
- HTTPS/TLS for all client-server and service-to-service communication — no exceptions
- Encrypt at rest: `whatsapp_api_token`, `integration_api_keys`, `oauth_tokens`
- Passwords: never stored in plaintext — bcrypt (min cost factor 12) or scrypt
- No sensitive data in logs (phone numbers, tokens, passwords)
- No sensitive data in frontend state, localStorage, or URL params

### Authentication
- JWT (short-lived access token + refresh token rotation) or secure server-side sessions
- Refresh tokens must be stored securely (httpOnly cookie, not localStorage)
- Implement brute-force protection on login endpoint (rate limiting + lockout)
- OAuth (Google) as alternative sign-in method — MVP optional, recommended

### Authorization
- Every API endpoint must verify: authenticated + authorized (user owns the resource)
- Multi-tenant isolation: all queries must be scoped to `user_id` or `account_id` — never trust client-provided IDs alone
- Row-level security or equivalent pattern for all data access
- Role-based access (future: admin vs. member vs. viewer) — architect for it from the start

### Third-Party API Security
- WhatsApp API tokens stored encrypted, retrieved server-side only
- Rotate tokens on re-connection or suspected compromise
- Webhook endpoints must validate incoming signature (WhatsApp webhook signature verification)

---

## 12. Testing Expectations

Every feature must be tested before it is considered complete. Testing is not optional.

### Required Test Coverage

**Unit Tests**
- All service-layer business logic
- Validation schemas
- Utility functions
- Placeholder resolution logic

**Integration Tests**
- API endpoint happy paths
- API endpoint error paths (invalid input, unauthorized, not found)
- Database operations (CRUD + constraint enforcement)
- Queue job creation and processing

**Compliance-Specific Tests (Mandatory)**
- Opt-in enforcement: campaign must not send to non-opted-in leads
- Unsubscribe detection: all 5 keywords, case-insensitive, with and without whitespace
- Idempotency: running same campaign twice must not produce duplicate messages
- Template validation: unapproved templates must be blocked from campaign execution

**Messaging-Specific Tests**
- Queue job is created on campaign start
- Message status transitions correctly (queued → sent → delivered → read)
- Failed messages are retried with backoff and eventually marked `Failed`
- Pausing campaign stops new jobs from being dispatched
- Stopping campaign marks remaining queued messages as `Cancelled`

### Test Data Rules
- Never use production data in tests
- Use factories/fixtures for consistent test data generation
- Test phone numbers must use non-real formats (e.g., `+15550000001`)

---

## 13. Implementation Discipline

Every feature — without exception — must follow this sequence:

1. **Define user story** — who is doing what, and why (business value)
2. **Validate against product goals** — does this serve a core user outcome?
3. **Check tier access** — is this feature gated to a specific plan? Enforce accordingly
4. **Enforce compliance constraints** — does this touch messaging? Apply all rules from Section 5
5. **Design data structure** — what entities are created, modified, or read?
6. **Define database schema** — tables, columns, indexes, constraints, migrations
7. **Define API contract** — endpoint, method, request shape, response shape, error codes
8. **Implement backend logic** — with auth, authorization, validation, and compliance checks
9. **Integrate queue** — mandatory for any feature that dispatches messages
10. **Build frontend UI** — using design system, with loading/error/empty states
11. **Test thoroughly** — unit, integration, compliance, and edge cases
12. **Update documentation** — API docs, inline comments, README if needed

Do not skip steps. Do not reorder steps. Backend before frontend, always.

---

## 14. Definition of Done

A feature is complete **only** when every item below is true. Partial completion is not done.

### Functional
- [ ] Core workflow works end-to-end
- [ ] All edge cases handled (empty input, missing data, API unavailable)
- [ ] Error states handled gracefully with user-facing feedback

### Compliance
- [ ] Opt-in enforcement active (no messages to non-opted leads)
- [ ] Unsubscribe detection works for all 5 keywords
- [ ] No duplicate messaging risk (idempotency verified)
- [ ] Template approval status enforced

### Quality
- [ ] Performance acceptable under expected load
- [ ] No N+1 queries or unindexed table scans on hot paths
- [ ] Security validated (auth, authorization, input sanitization)

### Testing
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Compliance-specific tests passing
- [ ] Manual QA completed

### Presentation
- [ ] UI consistent with design system (no rogue hex values, inline styles)
- [ ] Loading, error, and empty states implemented
- [ ] Responsive and accessible

### Documentation
- [ ] API contract documented
- [ ] Inline code comments where logic is non-obvious
- [ ] Any environment variables or config documented

---

## 15. What Good Looks Like — Quick Reference

| Area | Good | Bad |
|---|---|---|
| Messaging | Backend-only, queued, idempotent | Synchronous frontend send |
| Compliance | System-enforced opt-in and unsubscribe | "User should make sure" |
| Validation | Server-side, E.164 phone, structured errors | Frontend-only, vague "invalid" |
| UI | Token-driven, previews, clear feedback | Hardcoded colors, no loading states |
| DB | Indexed, paginated, FK enforced | `SELECT *`, unbounded queries |
| Testing | Compliance cases covered, no prod data | Happy-path only, skipped on deadline |
| Naming | `isUnsubscribed`, `handleCampaignSubmit` | `flag2`, `doThing`, `x` |
| Error handling | Logged with context, shown to user | Silent failure, raw stack trace to client |

---