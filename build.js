const fs = require('fs');
const path = require('path');

// Simple template replacement function
function replaceTemplate(template, data, prefix = '') {
    let result = template;

    for (const [key, value] of Object.entries(data)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Recursively handle nested objects
            result = replaceTemplate(result, value, fullKey);
        } else if (Array.isArray(value)) {
            // Handle arrays - for now just join them or skip
            const placeholder = `{{${fullKey}}}`;
            result = result.replace(new RegExp(placeholder, 'g'), JSON.stringify(value));
        } else {
            // Replace simple values
            const placeholder = `{{${fullKey}}}`;
            result = result.replace(new RegExp(placeholder, 'g'), String(value));
        }
    }

    return result;
}

// Read the content JSON
const contentPath = path.join(__dirname, 'content', 'pages', 'index.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// Read the template HTML
const templatePath = path.join(__dirname, 'src', 'index.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders
const output = replaceTemplate(template, content);

// Write the output
const outputPath = path.join(__dirname, 'index.html');
fs.writeFileSync(outputPath, output, 'utf8');

console.log('✓ Generated index.html from template');
