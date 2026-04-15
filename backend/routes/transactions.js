import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  checkBudgetLimit,
  createOrUpdateBudget,
  createTransaction,
  deleteTransaction,
  exportTransactionsData,
  getTransactionById,
  getTransactionsSummary,
  listBudgets,
  listTransactions,
  updateTransaction,
} from "../services/transactionService.js";
import {
  validateBudgetCheckInput,
  validateBudgetInput,
  validateExportQuery,
  validateSummaryQuery,
  validateTransactionCreateInput,
  validateTransactionFilterQuery,
  validateTransactionUpdateInput,
} from "../validators/transactionValidator.js";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: List transactions with optional filters
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by transaction type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, amount, type, category]
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", async (req, res) => {
  const validationError = validateTransactionFilterQuery(req.query);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const transactions = await listTransactions(req.user.sub, req.query);
    return res.json({ transactions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Coffee"
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 5.50
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: "expense"
 *               category:
 *                 type: string
 *                 example: "Food"
 *               tags:
 *                 type: string
 *                 example: "daily,coffee"
 *               notes:
 *                 type: string
 *                 example: "Morning coffee"
 *               budgetLimit:
 *                 type: number
 *                 format: float
 *                 example: 200.00
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", async (req, res) => {
  const validationError = validateTransactionCreateInput(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const result = await createTransaction(req.user.sub, req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/filters", async (req, res) => {
  const validationError = validateTransactionFilterQuery(req.query);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const transactions = await listTransactions(req.user.sub, req.query);
    return res.json({ transactions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/summary", async (req, res) => {
  const period = String(req.query.period || "monthly");

  const validationError = validateSummaryQuery(req.query);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const summary = await getTransactionsSummary(req.user.sub, period);
    return res.json(summary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/budget", async (req, res) => {
  try {
    const budgets = await listBudgets(req.user.sub);
    return res.json({ budgets });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/budget", async (req, res) => {
  const validationError = validateBudgetInput(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const budget = await createOrUpdateBudget(req.user.sub, req.body);
    return res.status(201).json({ budget });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/budget/check", async (req, res) => {
  const validationError = validateBudgetCheckInput(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const alert = await checkBudgetLimit(req.user.sub, req.body);
    return res.json(alert);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /transactions/export:
 *   get:
 *     summary: Export transactions as CSV or JSON
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, json]
 *           default: json
 *         description: Export format
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by transaction type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Export successful
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               description: CSV file content
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/export", async (req, res) => {
  const validationError = validateExportQuery(req.query);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const result = await exportTransactionsData(req.user.sub, req.query);
    res.type(result.contentType);

    if (result.format === "csv") {
      const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="transactions-${timestamp}.csv"`,
      );
      return res.send(result.body);
    }

    return res.json(result.body);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const transaction = await getTransactionById(req.user.sub, req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json({ transaction });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const validationError = validateTransactionUpdateInput(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const result = await updateTransaction(
      req.user.sub,
      req.params.id,
      req.body,
    );
    return res.json(result);
  } catch (error) {
    if (error.message === "Record not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update an existing transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *         example: "transaction-uuid"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionUpdateInput'
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Record not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.delete("/:id", async (req, res) => {
  try {
    const result = await deleteTransaction(req.user.sub, req.params.id);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *         example: "transaction-uuid"
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction deleted successfully"
 *       400:
 *         description: Error deleting transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting transaction"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

export default router;
