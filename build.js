const fs = require('fs');
const path = require('path');

// Helper to get value from nested object using string path "hero.title"
function getValue(data, path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], data);
}

// Template engine
function render(template, data) {
    let output = template;

    // Handle loops: {{#key}} ... {{/key}}
    // This regex matches {{#key}}content{{/key}}
    // It captures: 1=key, 2=content
    const loopRegex = /\{\{#([\w\.]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;

    output = output.replace(loopRegex, (match, key, content) => {
        const items = getValue(data, key);
        if (Array.isArray(items)) {
            return items.map(item => {
                const itemData = typeof item === 'object' && item !== null ? item : { this: item };
                return render(content, { ...data, ...itemData });
            }).join('');
        }
        return '';
    });

    // Handle simple variables: {{key}}
    const varRegex = /\{\{([\w\.]+)\}\}/g;
    output = output.replace(varRegex, (match, key) => {
        const value = getValue(data, key);
        return value !== undefined && value !== null ? value : '';
    });

    return output;
}

// Main build function
function build() {
    const contentDir = path.join(__dirname, 'content', 'pages');
    const srcDir = path.join(__dirname, 'src');
    const outDir = __dirname;

    // Get all JSON content files
    const contentFiles = fs.readdirSync(contentDir).filter(file => file.endsWith('.json'));

    contentFiles.forEach(file => {
        const slug = path.basename(file, '.json');
        const contentPath = path.join(contentDir, file);
        const templatePath = path.join(srcDir, `${slug}.html`);

        if (fs.existsSync(templatePath)) {
            console.log(`Building ${slug}...`);
            const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
            const template = fs.readFileSync(templatePath, 'utf8');

            const html = render(template, content);

            fs.writeFileSync(path.join(outDir, `${slug}.html`), html);
            console.log(`✓ Generated ${slug}.html`);
        } else {
            console.log(`⚠ No template found for ${slug}, skipping.`);
        }
    });
}

build();
