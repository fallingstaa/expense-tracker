import dotenv from 'dotenv';
import express from 'express';
import serverless from 'serverless-http';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from '../backend/docs/swaggerConfig.js';

dotenv.config();

const app = express();

app.use('/', swaggerUi.serve);
app.get('/', swaggerUi.setup(swaggerSpec, { explorer: true }));

export const handler = serverless(app);
export default handler;
