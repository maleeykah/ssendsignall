const fs = require('fs');

try {
    const rawData = fs.readFileSync('design-tokens.tokens.json', 'utf8');
    const data = JSON.parse(rawData);

    let css = ':root {\n';

    function toKebabCase(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
    }

    function processNode(node, prefix) {
        if (node && node.value !== undefined) {
            if (typeof node.value === 'object') {
                for (const [key, val] of Object.entries(node.value)) {
                    let unit = '';
                    if (typeof val === 'number' && key !== 'fontWeight' && key !== 'lineHeight' && key !== 'textCase' && key !== 'textDecoration' && key !== 'fontStyle' && key !== 'fontStretch') {
                        unit = 'px';
                    }
                    css += `  --sys-${prefix}-${toKebabCase(key)}: ${val}${unit};\n`;
                }
            } else {
                let val = node.value;
                // Basic unit addition if it looks like a simple number and might need a unit, 
                // but usually colors are strings, strings are strings. Let's just output val.
                if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
                    // Resolve aliases like "{primitive.color.collection.key.color.primary}" ?
                    // Simple replacement for aliases
                    let alias = val.slice(1, -1);
                    val = `var(--sys-${toKebabCase(alias.replace(/\./g, '-'))})`;
                }
                css += `  --sys-${prefix}: ${val};\n`;
            }
        } else if (typeof node === 'object' && node !== null) {
            for (const [key, val] of Object.entries(node)) {
                if (key !== 'extensions' && key !== 'type' && key !== 'description' && key !== 'blendMode') {
                    const cleanKey = toKebabCase(key);
                    const newPrefix = prefix ? `${prefix}-${cleanKey}` : cleanKey;
                    processNode(val, newPrefix);
                }
            }
        }
    }

    processNode(data, '');

    css += '}\n';

    fs.writeFileSync('tokens.css', css);
    console.log('Successfully generated tokens.css with CSS variables.');
} catch (error) {
    console.error('Error processing tokens:', error);
}
