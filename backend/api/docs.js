import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const swaggerSpecPath = new URL('../docs/swaggerSpec.json', import.meta.url);
const swaggerSpec = JSON.parse(readFileSync(swaggerSpecPath, 'utf8'));

function getRuntimeServerUrl(req) {
  const configuredUrl = String(process.env.SWAGGER_SERVER_URL || '').trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, '');
  }

  const forwardedProtoHeader = req.headers['x-forwarded-proto'];
  const protoFromForwarded = Array.isArray(forwardedProtoHeader)
    ? forwardedProtoHeader[0]
    : String(forwardedProtoHeader || '').split(',')[0].trim();

  const protocol = protoFromForwarded || (req.socket?.encrypted ? 'https' : 'http');
  const host = req.headers['x-forwarded-host'] || req.headers.host;

  if (!host) {
    return 'http://localhost:5000';
  }

  return `${protocol}://${host}/api`;
}

function buildSpecForRequest(req) {
  const serverUrl = getRuntimeServerUrl(req);
  return {
    ...swaggerSpec,
    servers: [
      {
        url: serverUrl,
        description: 'API server'
      }
    ]
  };
}

function renderSwaggerHtml(spec) {
  const specJson = JSON.stringify(spec).replace(/<\//g, '<\\/');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MyTrancy API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        spec: ${specJson},
        dom_id: '#swagger-ui',
        deepLinking: true,
        displayRequestDuration: true,
        explorer: true
      });
    </script>
  </body>
</html>`;
}

export default function handler(req, res) {
  const requestSpec = buildSpecForRequest(req);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(renderSwaggerHtml(requestSpec));
}
