import dotenv from 'dotenv';
import swaggerSpec from '../backend/docs/swaggerConfig.js';

dotenv.config();

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
			const swaggerRequestTimeoutMs = 15000;
			const originalFetch = window.fetch.bind(window);

			window.fetch = (input, init = {}) => {
				const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
				const timeoutId = setTimeout(() => {
					if (controller) {
						controller.abort();
					}
				}, swaggerRequestTimeoutMs);

				const nextInit = { ...init };
				if (controller && !init.signal) {
					nextInit.signal = controller.signal;
				}

				return originalFetch(input, nextInit).finally(() => clearTimeout(timeoutId));
			};

			window.ui = SwaggerUIBundle({
				spec: ${specJson},
				dom_id: '#swagger-ui',
				deepLinking: false,
				displayRequestDuration: true,
				explorer: true,
				requestInterceptor: (request) => {
					if (/\/auth\/login$/i.test(String(request.url || ''))) {
						if (request.headers) {
							delete request.headers.Authorization;
						}
					}
					return request;
				}
			});
		</script>
	</body>
</html>`;
}

function docsHandler(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.end(renderSwaggerHtml(swaggerSpec));
}

export const handler = docsHandler;
export default docsHandler;
