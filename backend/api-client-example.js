// MyTrancy API Client Example
// Copy this to your frontend project and adapt as needed

class MyTrancyAPI {
  constructor(baseURL = 'http://localhost:5000') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    this.token = response.token;
    localStorage.setItem('token', this.token);
    return response;
  }

  async register(email, password, name) {
    return await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Generic request method with auth
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = this.token;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Authentication required');
      }
      const error = await response.text();
      throw new Error(`API Error ${response.status}: ${error}`);
    }

    return await response.json();
  }

  // Transaction methods
  async getTransactions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/transactions?${queryParams}` : '/transactions';
    return await this.request(endpoint);
  }

  async createTransaction(transaction) {
    return await this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction)
    });
  }

  async updateTransaction(id, transaction) {
    return await this.request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction)
    });
  }

  async deleteTransaction(id) {
    return await this.request(`/transactions/${id}`, {
      method: 'DELETE'
    });
  }

  async exportTransactions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/transactions/export${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': this.token
      }
    });

    if (!response.ok) throw new Error('Export failed');

    return await response.blob();
  }

  // Category methods
  async getCategories() {
    return await this.request('/categories');
  }

  async createCategory(category) {
    return await this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    });
  }

  async updateCategory(id, category) {
    return await this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category)
    });
  }

  async deleteCategory(id) {
    return await this.request(`/categories/${id}`, {
      method: 'DELETE'
    });
  }

  // Tag methods
  async getTags() {
    return await this.request('/tags');
  }

  async createTag(tag) {
    return await this.request('/tags', {
      method: 'POST',
      body: JSON.stringify(tag)
    });
  }

  async updateTag(id, tag) {
    return await this.request(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tag)
    });
  }

  async deleteTag(id) {
    return await this.request(`/tags/${id}`, {
      method: 'DELETE'
    });
  }

  // Budget methods
  async getBudgets() {
    return await this.request('/budgets');
  }

  async createBudget(budget) {
    return await this.request('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget)
    });
  }

  async updateBudget(id, budget) {
    return await this.request(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budget)
    });
  }

  async deleteBudget(id) {
    return await this.request(`/budgets/${id}`, {
      method: 'DELETE'
    });
  }

  // Recurring transaction methods
  async getRecurringTransactions() {
    return await this.request('/recurring');
  }

  async createRecurringTransaction(recurring) {
    return await this.request('/recurring', {
      method: 'POST',
      body: JSON.stringify(recurring)
    });
  }

  async updateRecurringTransaction(id, recurring) {
    return await this.request(`/recurring/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recurring)
    });
  }

  async deleteRecurringTransaction(id) {
    return await this.request(`/recurring/${id}`, {
      method: 'DELETE'
    });
  }
}

// Usage example:
/*
const api = new MyTrancyAPI();

// Login
await api.login('user@example.com', 'password');

// Get transactions
const transactions = await api.getTransactions({ type: 'expense', limit: 10 });

// Create transaction
const newTransaction = await api.createTransaction({
  title: 'Coffee',
  amount: 5.50,
  type: 'expense',
  category: 'Food',
  tags: ['daily']
});

// Export to CSV
const csvBlob = await api.exportTransactions({ startDate: '2024-01-01' });
const url = URL.createObjectURL(csvBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'transactions.csv';
a.click();
*/

export default MyTrancyAPI;