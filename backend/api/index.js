import dotenv from 'dotenv';
import serverless from 'serverless-http';

import app from '../app.js';

dotenv.config();

const appHandler = serverless(app);

function applyCorsHeaders(req, res) {
	const origin = req.headers.origin || '*';
	res.setHeader('Access-Control-Allow-Origin', origin);
	res.setHeader('Vary', 'Origin');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
	res.setHeader('Access-Control-Max-Age', '86400');
}

export const handler = async (req, res) => {
	applyCorsHeaders(req, res);

	if (req.method === 'OPTIONS') {
		res.statusCode = 204;
		res.end();
		return;
	}

	return appHandler(req, res);
};

export default handler;
