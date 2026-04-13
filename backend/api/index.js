import dotenv from 'dotenv';
import serverless from 'serverless-http';

import app from '../app.js';

dotenv.config();

export const handler = serverless(app);
export default handler;
