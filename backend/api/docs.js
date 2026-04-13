import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const swaggerSpecPath = new URL('../docs/swaggerSpec.json', import.meta.url);
const swaggerSpec = JSON.parse(readFileSync(swaggerSpecPath, 'utf8'));
const html = swaggerUi.generateHTML(swaggerSpec, { explorer: true });

export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}
