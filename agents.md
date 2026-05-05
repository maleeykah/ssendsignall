# Send Signal – Agent Coordination Document

---

## 1. Product Definition

Send Signal is a web-based SaaS platform that enables businesses to convert inbound leads into real-time WhatsApp conversations through automated, personalized messaging at scale.

The system bridges the gap between lead acquisition (e.g., Twitter, TikTok, Instagram, Facebook Lead Ads) and engagement by allowing users to send tailored WhatsApp messages using dynamic templates — making each outreach feel one-to-one, even at thousands of contacts.

### Core Value Proposition
- Instant engagement with new leads (within minutes of capture)
- Personalized communication at scale — feel of 1:1, efficiency of bulk
- Higher conversion through WhatsApp vs. email/SMS (higher open and read rates)
- Automated but human-like outreach using approved templates
- No-code interface accessible to non-technical marketing and sales teams

### Problem Being Solved
- Emails and SMS yield low engagement; WhatsApp has far higher visibility
- Manual WhatsApp follow-ups are time-consuming and error-prone
- Leads from social platforms (TikTok, Twitter) sit in spreadsheets with no fast follow-up path
- Without a structured system, businesses risk violating WhatsApp's strict policies

---

## 2. Target Users

### Primary Users
- **Digital Marketers & Growth Hackers** — running campaigns on TikTok, Twitter, Instagram; need to convert leads quickly after acquisition
- **Sales Development Representatives (SDRs) & CRM Managers** — automating initial touchpoints while preserving a human tone; focusing attention on warm/replied leads
- **Small Business Owners** — no dedicated sales staff; need automated but personal follow-up on social media leads
- **Agencies** — managing outreach for multiple clients from a centralized tool

### Key Use Cases to Always Keep in Mind
1. **Immediate Welcome Message** — Lead submits phone number from a TikTok ad; Send Signal fires a personalized WhatsApp message within minutes
2. **Post-Event Lead Nurturing** — 100 webinar attendees imported via CSV; campaign sent with name + company personalization
3. **Cart Recovery via WhatsApp** — E-commerce lead browsed but didn't buy; personalized re-engagement message with discount code sent via WhatsApp

---

## 3. Core User Outcomes

Users must be able to:

- Import and manage leads efficiently (CSV upload with preview, column mapping, duplicate detection)
- Segment and filter contacts by source, tags, or import batch
- Create reusable personalized message templates with dynamic placeholders
- Send WhatsApp campaigns instantly or on a schedule
- Track delivery, reads, and replies at both campaign and lead level
- Manage the full lead lifecycle and conversation status
- Analyze campaign performance and conversion metrics
- Maintain full compliance with WhatsApp Business API policies
- Operate without needing technical knowledge (no-code first)

---

## 4. Compliance Principles (Non-Negotiable)

All messaging must strictly follow WhatsApp Business API (Meta) policies. These rules must be enforced at the system level — not left to the user.

### Opt-In Requirement
- Messages must only be sent to users with verified consent
- System must require explicit confirmation of opt-in before any campaign executes
- Log opt-in confirmation per campaign for audit trail and legal protection

### Unsubscribe Handling
Detect and process the following unsubscribe keywords in incoming messages:

- STOP
- UNSUBSCRIBE
- CANCEL
- END
- QUIT

Enforcement rules:
- Detection is case-insensitive
- Enforcement is immediate upon detection
- Auto-update lead status → `Unsubscribed`
- Block lead from all future campaigns
- Re-engagement only permitted after explicit re-opt-in
- Log the unsubscribe event with timestamp for compliance records

### Template Compliance
- All outbound messages to new contacts must use WhatsApp-approved templates
- Dynamic placeholders must not alter the approved template structure
- Template approval flow must be part of the template creation journey

### Rate Limiting
- Respect WhatsApp throughput limits at all times
- Implement controlled batch sending with configurable batch sizes and delays
- Use queue system to manage throughput; never send directly from frontend

### GDPR & Data Compliance
- Encrypt sensitive fields at rest (WhatsApp auth tokens, API keys, phone numbers where required)
- All data in transit must use HTTPS/SSL
- Support data deletion requests (especially for EU users)
- Regular encrypted database backups

---

## 5. Product Scope (MVP)

### Onboarding Flow
1. User authentication (email/password or Google OAuth)
2. Email verification
3. WhatsApp Business API connection (Meta OAuth or QR code scan)
4. Lead import (CSV upload + column mapping + preview)
5. First template creation (with placeholder guidance)
6. First campaign setup
7. Dashboard tour (Leads, Templates, Campaigns, Analytics)

### MVP Boundaries (What Is NOT in Scope for MVP)
- Mobile app (web only)
- Voice notes or advanced WhatsApp media types
- Multi-step drip/automation sequences
- Chatbot or AI reply handling
- CRM integrations (HubSpot, Salesforce, Zoho)
- Multi-user/team collaboration (single user per account in MVP)
- A/B message testing

---

## 6. Lead Management System

### Capabilities
- CSV upload with live preview before import confirmation
- Column mapping (user maps CSV columns to lead fields)
- Validation on import (phone number format, required fields)
- Duplicate detection and handling
- Tagging and segmentation
- Source tracking (TikTok, Twitter, Instagram, Facebook, Manual, etc.)
- Manual single lead entry

### Lead Fields
| Field | Type | Required |
|---|---|---|
| phone_number | string | ✅ Yes |
| first_name | string | No |
| last_name | string | No |
| email | string | No |
| source | string | No |
| tags | array | No |
| custom_fields | JSON | No |
| opt_in | boolean | No |
| unsubscribed | boolean | No |
| created_at | timestamp | Auto |

### Lead Status Lifecycle
```
New → Contacted → Delivered → Read → Replied → Interested / Not Interested → Converted
                                                                            ↓
                                                                      Unsubscribed
                                                                      Bounced
```

All status transitions must be logged with timestamps in the lead activity timeline.

---

## 7. Messaging System

### Templates
- Support dynamic placeholders:
  - `{FirstName}`
  - `{LastName}`
  - `{Source}`
  - Any imported custom fields
- Real-time preview using actual sample lead data
- Validate placeholder correctness before save
- Templates must be submitted for WhatsApp approval before use in campaigns
- Store approved template ID alongside template record

### Campaign Execution Flow
1. Select audience (all leads, or filtered segment by source/tag/batch)
2. Select or create template (show live preview with substitution)
3. Configure send settings:
   - Send immediately or schedule (date + time)
   - Batch size
   - Delay between messages (ms/s)
4. Review confirmation screen:
   - Number of recipients
   - Template preview
   - Estimated send duration
   - Opt-in confirmation checkbox
5. Confirm and queue campaign
6. Execute via background queue
7. Real-time progress visible in Campaign dashboard (e.g., "Sending… 45/120 sent")

### Message Lifecycle Status
```
Queued → Sending → Sent → Delivered → Read → Replied → Converted
                       ↘ Failed
                       ↘ Bounced
                       ↘ Unsubscribed
```

---

## 8. Messaging Architecture (Critical — Never Violate)

### Server-Side Enforcement
- **ALL WhatsApp messages must be sent exclusively from the backend**
- **The frontend must never have access to or call the WhatsApp API directly**
- API credentials must never be exposed to the client

### Queue System
- Use a job queue (e.g., Bull/BullMQ with Redis, or similar) for all message dispatch
- Queue controls throughput, retry logic, and failure handling
- Prevents system overload and WhatsApp API rate violations
- Queue must be fault-tolerant — surviving server restarts without losing jobs

### Idempotency
- Each message is uniquely identified by: `lead_id + campaign_id`
- System must prevent duplicate sends even if:
  - Campaign is re-triggered
  - System retries a failed job
  - Multiple workers process simultaneously
- Use database-level unique constraints or atomic checks before dispatch

### Retry Logic
- On message failure: retry with exponential backoff
- After N retries: mark message as `Failed` and log reason
- Alert user of failed messages in Campaign detail view

---

## 9. Analytics System

### Campaign-Level Metrics
| Metric | Description |
|---|---|
| Total leads targeted | Count of recipients selected |
| Messages sent | Successfully dispatched |
| Delivery rate | Delivered / Sent |
| Read rate | Read / Delivered |
| Reply rate | Replied / Delivered |
| Conversion rate | Converted / Targeted |
| Failure rate | Failed / Sent |

### Lead-Level Tracking
- Full activity timeline per lead (with timestamps)
- Complete message history
- All status transitions logged

### Platform-Level Success Metrics (Agent Should Be Aware Of)
- DAU/MAU (Daily/Monthly Active Users)
- Onboarding completion rate (sign-up → first campaign sent)
- Campaigns sent per user per month
- Free-to-paid conversion rate
- Churn rate (monthly)
- Message throughput and latency
- System uptime (target: 99.9%+)

---

## 10. Database Model

### Minimum Required Tables
- `users` — account owners, auth credentials, subscription tier
- `whatsapp_accounts` — connected WABA details, API tokens (encrypted)
- `leads` — all lead records with fields and status
- `templates` — message templates with placeholder definitions and WhatsApp approval status
- `campaigns` — campaign config, audience, schedule, status, metrics
- `messages` — individual message records (lead_id, campaign_id, status, timestamps)
- `analytics_events` — granular event log (status transitions, opens, replies)

### Key Constraints
- `messages` table: unique constraint on `(lead_id, campaign_id)` for idempotency
- `leads` table: index on `phone_number`, `source`, `unsubscribed`, `opt_in`
- Soft-delete pattern preferred over hard deletes for audit trails

---

## 11. Technical Architecture

### Frontend
- Single Page Application (SPA) — React or Vue
- Responsive design (desktop-primary, mobile-aware)
- Optimized for data-heavy views (lead tables, campaign lists)
- Must never store or use WhatsApp API credentials
- Real-time campaign progress updates (polling or WebSocket)

### Backend Services
| Service | Responsibility |
|---|---|
| **Auth Service** | Registration, login, OAuth, JWT/session management |
| **Lead Service** | CRUD for leads, CSV import, duplicate detection, segmentation |
| **Template Service** | Template CRUD, placeholder validation, WhatsApp approval flow |
| **Campaign Service** | Campaign creation, scheduling, queue dispatch, status tracking |
| **Messaging Service** | WhatsApp API communication, message dispatch, status callbacks |
| **Integration/Webhook Service** | Incoming WhatsApp messages, unsubscribe detection, status webhooks |
| **Analytics Service** | Aggregated metrics, event logging, dashboard data |

### Database
- **Primary DB:** PostgreSQL (relational, structured queries, joins across users/leads/campaigns)
- **Cache/Queue:** Redis — job queue (BullMQ), session store, rate limiting counters
- **Log Management:** Consider separate log store or pruning strategy for `messages` table at scale

### Security Requirements
- HTTPS everywhere (no HTTP)
- JWT or secure server-side sessions; bcrypt/scrypt password hashing
- All API endpoints enforce authorization — users can only access their own data
- WhatsApp API tokens encrypted at rest
- Multi-tenant data isolation enforced at query level
- Rate limiting on auth endpoints (brute force protection)

---

## 12. User Experience Principles

- **Simplicity** — No-code friendly; non-technical users must be able to operate fully
- **Speed** — Full campaign setup in under a few minutes
- **Clarity** — Always show campaign impact (recipient count, preview, estimated duration) before sending
- **Feedback** — Real-time status updates during campaign execution
- **Safety** — Confirm before any destructive or large-scale action (sending, importing, deleting)

### Key UX Features
- CSV preview table before import confirmation
- Template preview with real lead data substitution
- Campaign confirmation screen showing: recipient count, template preview, estimated send duration
- Progress indicator during live campaign sending
- Clear error states for failed messages with actionable reasons

---

## 13. Pricing & Feature Tiers (Agent Context)

Agents must understand the tier model when building features that relate to limits or access control.

| Feature | Free (Starter) | Pro (~$20/mo) | Enterprise (Custom) |
|---|---|---|---|
| Messages/month | 100 | 5,000 + overage | Unlimited / High volume |
| Users | 1 | Up to 5 | Unlimited |
| Lead sources | 1 (CSV only) | Multiple (Twitter, TikTok, FB) | All + API access |
| Scheduling | ❌ | ✅ | ✅ |
| Drip campaigns | ❌ | ✅ | ✅ |
| A/B testing | ❌ | ✅ | ✅ |
| Analytics export | ❌ | ✅ | ✅ |
| SSO / Audit logs | ❌ | ❌ | ✅ |
| Support | Email | Priority / Live chat | Dedicated account manager |
| Data agreements | ❌ | ❌ | GDPR DPA + on-demand deletion |

---

## 14. Future Roadmap (Post-MVP — Engineering Awareness)

Do not build these in MVP, but architect to accommodate:

- **Drip Campaigns** — Multi-step sequences with time-based triggers and stop-on-reply logic
- **Chatbot / AI Replies** — Rule-based or AI-driven auto-responses to incoming WhatsApp messages
- **CRM Integrations** — HubSpot, Salesforce, Zoho (bi-directional sync)
- **Multi-channel Inbox** — Unified inbox across WhatsApp, Messenger, Instagram DMs
- **Mobile App** — iOS and Android client
- **Advanced Analytics** — Cohort analysis, A/B test results, conversion attribution
- **Multi-number Support** — Multiple WhatsApp Business numbers per account for volume scaling
- **Send Signal API** — Programmatic campaign triggering for enterprise integrations

---

## 15. Implementation Workflow

Every feature must follow this sequence without skipping steps:

1. Define user story (who, what, why)
2. Validate against product goals and tier access rules
3. Enforce compliance rules (especially for anything touching messaging)
4. Design data model
5. Define database schema (with indexes and constraints)
6. Define API contracts (endpoints, request/response shapes, error codes)
7. Implement backend logic (with auth and authorization checks)
8. Implement frontend UI (no API keys in client)
9. Integrate with queue system (mandatory for all messaging features)
10. Test thoroughly (unit, integration, and compliance edge cases)

---

## 16. Definition of Completion

A feature is complete only when ALL of the following are true:

- Core workflow is functional end-to-end
- Edge cases are handled (empty states, invalid inputs, API failures)
- Compliance rules are enforced (opt-in check, unsubscribe detection, template approval)
- No duplicate messaging risk (idempotency verified)
- Performance is acceptable under expected load
- Security requirements met (auth, authorization, encryption)
- Automated tests pass (unit + integration)
- Manual QA completed
- Documentation updated (API docs, inline comments)

---

## 17. Key Risks & Mitigations (Engineering Awareness)

| Risk | Impact | Mitigation |
|---|---|---|
| WhatsApp API policy changes | Platform dependency risk | Abstract WhatsApp integration behind a service layer; monitor Meta changelogs |
| Message deliverability / spam misuse | Account bans, reputation damage | Enforce opt-in at system level; rate limiting; abuse detection |
| Competitive pressure (CleverTap, WATI, Respond.io, Zoko, AiSensy) | User acquisition risk | Stay focused on simplicity + social media lead source niche; fast time-to-first-campaign |
| Scaling under high campaign volume | Queue backups, slowdowns | Horizontal queue workers; WhatsApp throughput tiering by quality rating |
| GDPR / legal compliance | Regulatory fines | Encrypt PII, support deletion requests, log consent |
| Free-to-paid conversion | Revenue risk | Gate high-value features (scheduling, drip, export) behind Pro |
| WhatsApp API access barriers for small users | User drop-off at onboarding | Provide clear Meta WABA setup guide; consider sandbox testing mode |

---

## 18. Competitive Context (Agent Awareness)

Send Signal competes in the WhatsApp marketing automation space. Key differentiators to maintain:

| Competitor | Their Strength | Our Angle |
|---|---|---|
| CleverTap | Enterprise, AI, omnichannel | Simpler, faster setup; social lead-source focus |
| WATI | SMB team inbox, official BSP | Campaign-first vs. support-first |
| Twilio | Developer API, flexibility | No-code UI; non-technical users |
| Respond.io | Multi-channel unified inbox | WhatsApp-first; lead import from social |
| Zoko | E-commerce / Shopify | Broader use cases beyond e-com |
| AiSensy | No-code chatbots, India market | Global focus; social media lead pipeline |

**Send Signal's unique position:** The fastest path from a social media lead list → personalized WhatsApp conversation, designed for non-technical marketers and SDRs.

---
