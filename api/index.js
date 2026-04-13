import dotenv from 'dotenv';
import serverless from 'serverless-http';

import app from '../backend/app.js';

dotenv.config();

export const handler = serverless(app);
export default handler;
