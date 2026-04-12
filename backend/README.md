# MyTrancy Expense Tracker Backend API

A comprehensive REST API for personal expense tracking built with Express.js, Supabase, and JWT authentication.

## 🚀 Overview

This backend provides a complete API for managing personal finances including:
- User authentication and authorization
- Transaction management (income/expenses)
- Budget tracking and limits
- Category organization
- Tag system for transactions
- Recurring transactions
- CSV export functionality
- **Built-in web tester** at `/tester` for easy testing
- Interactive Swagger documentation at `/api-docs`

## 🛠 Tech Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI 3.0
- **Development**: Nodemon for hot reloading

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project
- Git

## ⚡ Quick Start

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend root directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret-here

# Server Configuration (optional)
PORT=5000
```

### 3. Database Setup

Run the SQL script to create required tables:

```bash
# Execute the create_tables.sql file in your Supabase SQL editor
# Or use the Supabase dashboard to run the SQL commands
```

The required tables are:
- `users` - User accounts
- `transactions` - Financial transactions
- `categories` - Transaction categories
- `tags` - Transaction tags
- `budgets` - Budget limits
- `recurring_transactions` - Recurring transaction templates

**Note**: The `create_tables.sql` file contains all necessary table definitions with proper relationships and constraints.

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

### 5. Test the API

**🎯 Recommended: Use the built-in web tester**
- Visit: `http://localhost:5000/tester`
- Complete one-page UI for testing all endpoints
- No external tools needed!

**Alternative: Use Swagger UI**
- Visit: `http://localhost:5000/api-docs`
- Interactive API documentation
- Test endpoints directly in browser

## 📚 API Documentation

### Swagger UI

Access interactive API documentation at: `http://localhost:5000/api-docs`

The Swagger UI provides:
- Complete endpoint documentation
- Request/response examples
- Authentication testing
- Try-it-out functionality

### Authentication

All protected endpoints require JWT authentication. You can send the token in the Authorization header in two ways:

**Option 1: Just the token**
```
Authorization: <your-jwt-token>
```

**Option 2: Bearer format (also supported)**
```
Authorization: Bearer <your-jwt-token>
```

#### Authentication Flow

1. **Register**: `POST /auth/register`
   ```json
   {
     "email": "user@example.com",
     "password": "securepassword",
     "name": "John Doe"
   }
   ```

2. **Login**: `POST /auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "securepassword"
   }
   ```

3. **Use Token**: Include the returned JWT in all subsequent requests

## 🛣 Available Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with code

### Transactions
- `GET /transactions` - List user transactions (with filtering)
- `POST /transactions` - Create new transaction
- `GET /transactions/:id` - Get transaction by ID
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction
- `GET /transactions/export` - Export transactions as CSV
- `GET /transactions/summary` - Get transaction summary

### Categories
- `GET /categories` - List user categories
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Tags
- `GET /tags` - List user tags
- `POST /tags` - Create new tag
- `PUT /tags/:id` - Update tag
- `DELETE /tags/:id` - Delete tag

### Budgets
- `GET /budgets` - List user budgets
- `POST /budgets` - Create/update budget
- `GET /budgets/:id` - Get budget by ID
- `PUT /budgets/:id` - Update budget
- `DELETE /budgets/:id` - Delete budget

### Recurring Transactions
- `GET /recurring` - List recurring transactions
- `POST /recurring` - Create recurring transaction
- `PUT /recurring/:id` - Update recurring transaction
- `DELETE /recurring/:id` - Delete recurring transaction
- `POST /recurring/run` - Execute due recurring transactions

## 🔧 Development

### Project Structure

```
backend/
├── index.js              # Main server file
├── routes/               # API route handlers
├── services/             # Business logic
├── validators/           # Input validation
├── utils/                # Utility functions
├── middleware/           # Express middleware
├── docs/                 # API documentation
└── public/               # Static files
```

### Key Files

- `index.js` - Express app setup and route mounting
- `docs/swaggerConfig.js` - Swagger/OpenAPI configuration
- `utils/supabaseClient.js` - Supabase client configuration
- `middleware/auth.js` - JWT authentication middleware

### Frontend Integration Example

Check out `api-client-example.js` for a complete JavaScript API client class that handles authentication and all endpoints.

Here's a basic JavaScript example for integrating with the API:

```javascript
// API Base Configuration
const API_BASE = 'http://localhost:5000';

// Authentication Functions
async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) throw new Error('Login failed');

  const data = await response.json();
  localStorage.setItem('token', data.token); // Store JWT token
  return data;
}

async function register(email, password, name) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });

  if (!response.ok) throw new Error('Registration failed');

  return await response.json();
}

// API Request Helper (automatically includes auth token)
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': token })
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers }
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  return await response.json();
}

// Usage Examples
async function loadTransactions() {
  try {
    const transactions = await apiRequest('/transactions');
    console.log('Transactions:', transactions);
    return transactions;
  } catch (error) {
    console.error('Failed to load transactions:', error);
  }
}

async function createTransaction(transactionData) {
  try {
    const newTransaction = await apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData)
    });
    console.log('Created transaction:', newTransaction);
    return newTransaction;
  } catch (error) {
    console.error('Failed to create transaction:', error);
  }
}

// Example transaction data
const exampleTransaction = {
  title: "Grocery Shopping",
  amount: 85.50,
  type: "expense",
  category: "Food",
  tags: ["weekly", "groceries"],
  notes: "Weekly grocery run",
  date: new Date().toISOString()
};
```

### Testing the API

Use the built-in tester page: `http://localhost:5000/tester`

**Features:**
- **One-page UI** for testing all endpoints
- **Authentication testing** (signup, login, forgot password, reset)
- **Transactions CRUD** with full filtering and sorting
- **Categories & Tags management**
- **Budget creation and monitoring**
- **Monthly/Weekly summaries**
- **CSV/JSON export** with automatic download
- **Real-time response display**
- **Token management** (save/clear JWT tokens)

Or use tools like:
- Postman
- Insomnia
- curl commands
- Swagger UI "Try it out" feature

## 🚨 Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

Error responses include:
```json
{
  "error": "Error message description",
  "details": "Additional error information (optional)"
}
```

## 🔒 Security

- JWT tokens expire after authentication
- Passwords are securely hashed
- CORS is configured for cross-origin requests
- Input validation on all endpoints
- SQL injection protection via parameterized queries

## 📞 Support

For questions about the API:
1. Check the Swagger documentation first
2. Review the route handlers in `/routes/`
3. Check service logic in `/services/`
4. Contact the backend team

## 🚀 Deployment

For production deployment:
1. Set environment variables securely
2. Use a process manager like PM2
3. Configure proper logging
4. Set up database backups
5. Enable HTTPS

---

**Happy coding! 🎉**
