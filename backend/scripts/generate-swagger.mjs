import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import swaggerSpec from '../docs/swaggerConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputPath = join(__dirname, '../docs/swaggerSpec.json');

writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));
console.log(`Wrote Swagger spec to ${outputPath}`);
