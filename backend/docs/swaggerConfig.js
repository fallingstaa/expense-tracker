import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverUrl = process.env.SWAGGER_SERVER_URL
  ? process.env.SWAGGER_SERVER_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api`
    : 'http://localhost:5000';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyTrancy Expense Tracker API',
      version: '1.0.0',
      description: 'API for managing personal finances, transactions, budgets, and categories',
    },
    servers: [
      {
        url: serverUrl,
        description: 'API server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '76d96d13-e6c4-467c-a230-cef51596c96f' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'd2163dd5-24e3-4320-8642-2ecc2872d1bb' },
            userId: { type: 'string', example: '76d96d13-e6c4-467c-a230-cef51596c96f' },
            title: { type: 'string', example: 'Coffee' },
            amount: { type: 'number', format: 'float', example: 5.50 },
            type: { type: 'string', enum: ['income', 'expense'], example: 'expense' },
            category: { type: 'string', example: 'Food' },
            tags: { type: 'array', items: { type: 'string' }, example: ['daily', 'coffee'] },
            notes: { type: 'string', example: 'Morning coffee' },
            recurring: { type: 'boolean', example: false },
            recurringInterval: { type: 'string', example: 'monthly' },
            budgetLimit: { type: 'number', format: 'float', example: 200.00 },
            date: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        TransactionInput: {
          type: 'object',
          required: ['title', 'amount', 'type', 'category'],
          properties: {
            title: { type: 'string', example: 'Coffee' },
            amount: { type: 'number', format: 'float', example: 5.50 },
            type: { type: 'string', enum: ['income', 'expense'], example: 'expense' },
            category: { type: 'string', example: 'Food' },
            tags: { type: 'array', items: { type: 'string' }, example: ['daily', 'coffee'] },
            notes: { type: 'string', example: 'Morning coffee' },
            recurring: { type: 'boolean', example: false },
            recurringInterval: { type: 'string', enum: ['daily', 'weekly', 'monthly'], example: 'monthly' },
            budgetLimit: { type: 'number', format: 'float', example: 200.00 },
            createdAt: { type: 'string', format: 'date-time' },
            date: { type: 'string', format: 'date-time' },
          },
        },
        TransactionUpdateInput: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Coffee' },
            amount: { type: 'number', format: 'float', example: 5.50 },
            type: { type: 'string', enum: ['income', 'expense'], example: 'expense' },
            category: { type: 'string', example: 'Food' },
            tags: { type: 'array', items: { type: 'string' }, example: ['daily', 'coffee'] },
            notes: { type: 'string', example: 'Morning coffee' },
            recurring: { type: 'boolean', example: false },
            recurringInterval: { type: 'string', enum: ['daily', 'weekly', 'monthly'], example: 'monthly' },
            budgetLimit: { type: 'number', format: 'float', example: 200.00 },
            createdAt: { type: 'string', format: 'date-time' },
            date: { type: 'string', format: 'date-time' },
          },
        },
        Budget: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            category: { type: 'string', example: 'Food' },
            limitAmount: { type: 'number', format: 'float', example: 500.00 },
            period: { type: 'string', enum: ['weekly', 'monthly'], example: 'monthly' },
            active: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            name: { type: 'string', example: 'Food' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CategoryInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Shopping' },
            color: { type: 'string', example: '#FF6B6B' },
          },
        },
        BudgetInput: {
          type: 'object',
          required: ['category', 'limitAmount'],
          properties: {
            category: { type: 'string', example: 'Food' },
            limitAmount: { type: 'number', format: 'float', example: 500.00 },
            period: { type: 'string', enum: ['weekly', 'monthly'], example: 'monthly' },
            active: { type: 'boolean', example: true },
          },
        },
        Tag: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            name: { type: 'string', example: 'urgent' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        TagInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'urgent' },
          },
        },
        RecurringTransaction: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            title: { type: 'string', example: 'Monthly Rent' },
            amount: { type: 'number', format: 'float', example: 1200.00 },
            type: { type: 'string', enum: ['income', 'expense'], example: 'expense' },
            category: { type: 'string', example: 'Housing' },
            tags: { type: 'array', items: { type: 'string' }, example: ['monthly', 'rent'] },
            notes: { type: 'string', example: 'Monthly rent payment' },
            frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'], example: 'monthly' },
            interval: { type: 'number', example: 1 },
            nextRunAt: { type: 'string', format: 'date-time' },
            active: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RecurringTransactionInput: {
          type: 'object',
          required: ['title', 'amount', 'type', 'frequency', 'nextRunAt'],
          properties: {
            title: { type: 'string', example: 'Monthly Rent' },
            amount: { type: 'number', format: 'float', example: 1200.00 },
            type: { type: 'string', enum: ['income', 'expense'], example: 'expense' },
            category: { type: 'string', example: 'Housing' },
            tags: { type: 'array', items: { type: 'string' }, example: ['monthly', 'rent'] },
            notes: { type: 'string', example: 'Monthly rent payment' },
            frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'], example: 'monthly' },
            interval: { type: 'number', example: 1 },
            nextRunAt: { type: 'string', format: 'date-time', example: '2024-02-01T00:00:00.000Z' },
            active: { type: 'boolean', example: true },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Authentication required' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

export default swaggerJSDoc(options);
