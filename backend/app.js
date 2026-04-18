import cors from 'cors';
import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

import authMiddleware from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import budgetsRoutes from './routes/budgets.js';
import categoriesRoutes from './routes/categories.js';
import recurringRoutes from './routes/recurring.js';
import tagsRoutes from './routes/tags.js';
import transactionsRoutes from './routes/transactions.js';
import supabase from './utils/supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerSpecPath = path.join(__dirname, 'docs', 'swaggerSpec.json');
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

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/tags', tagsRoutes);
app.use('/budgets', budgetsRoutes);
app.use('/recurring', recurringRoutes);

app.get('/swagger.json', (req, res) => {
  const serverUrl = getRuntimeServerUrl(req);
  res.json({
    ...swaggerSpec,
    servers: [
      {
        url: serverUrl,
        description: 'API server'
      }
    ]
  });
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/tester', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tester.html'));
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, { explorer: true, swaggerUrl: '/swagger.json' }));
app.get('/docs', (req, res) => {
  res.redirect('/api-docs/');
});
app.get('/docs/', (req, res) => {
  res.redirect('/api-docs/');
});

app.get('/supabase-test', async (req, res) => {
  try {
    const endpoint = `${process.env.SUPABASE_URL.replace(/\/$/, '')}/auth/v1/settings`;
    const response = await fetch(endpoint, {
      headers: {
        apikey: process.env.SUPABASE_KEY
      }
    });

    const payload = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        message: 'Supabase connectivity check failed',
        error: payload
      });
    }

    return res.json({
      ok: true,
      message: 'Supabase connected',
      clientInitialized: Boolean(supabase),
      authProviders: payload.external
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unexpected error while connecting to Supabase',
      error: error.message
    });
  }
});

app.get('/me', authMiddleware, (req, res) => {
  res.json({
    ok: true,
    user: req.user
  });
});

export default app;
