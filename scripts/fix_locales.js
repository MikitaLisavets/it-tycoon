const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../messages');
const EN_FILE = 'en.json';

// Helper to unflatten keys: "Section.key" -> { Section: { key: "value" } }
function unflatten(data) {
    const result = {};
    for (const i in data) {
        const keys = i.split('.');
        keys.reduce((r, e, j) => {
            return r[e] || (r[e] = keys.length - 1 === j ? data[i] : {})
        }, result);
    }
    return result;
}

// Helper to sort keys to match en.json order (optional but good for diffs)
function sortKeys(target, reference) {
    if (typeof reference !== 'object' || reference === null) return target;
    const sorted = {};
    const refKeys = Object.keys(reference);
    const targetKeys = Object.keys(target);

    // First add keys present in reference order
    for (const key of refKeys) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            if (typeof target[key] === 'object' && !Array.isArray(target[key]) && target[key] !== null && typeof reference[key] === 'object' && !Array.isArray(reference[key]) && reference[key] !== null) {
                sorted[key] = sortKeys(target[key], reference[key]);
            } else {
                sorted[key] = target[key];
            }
        }
    }

    // Then add remaining keys from target
    for (const key of targetKeys) {
        if (!Object.prototype.hasOwnProperty.call(sorted, key)) {
            sorted[key] = target[key];
        }
    }

    return sorted;
}

function run() {
    const enPath = path.join(MESSAGES_DIR, EN_FILE);
    if (!fs.existsSync(enPath)) {
        console.error(`Error: ${EN_FILE} not found in ${MESSAGES_DIR}`);
        process.exit(1);
    }

    const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));

    fs.readdir(MESSAGES_DIR, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            // Skip en.json and en-quizzes.json
            if (file === EN_FILE || file === 'en-quizzes.json' || !file.endsWith('.json')) {
                return;
            }

            const filePath = path.join(MESSAGES_DIR, file);
            console.log(`Processing ${file}...`);

            try {
                const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                // Unflatten
                const unflattened = unflatten(content);

                // Sort keys to look like en.json
                const sorted = sortKeys(unflattened, enContent);

                fs.writeFileSync(filePath, JSON.stringify(sorted, null, 4));
                console.log(`Updated ${file}`);
            } catch (e) {
                console.error(`Error processing ${file}:`, e);
            }
        });
    });
}

run();
