import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { listRecurringTransactions, createRecurringTransaction, runDueRecurringTransactions, updateRecurringTransaction, deleteRecurringTransaction } from '../services/transactionService.js';
import { validateRecurringInput } from '../validators/transactionValidator.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /recurring:
 *   get:
 *     summary: List all recurring transactions for the current user
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recurring transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recurring:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecurringTransaction'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    const recurring = await listRecurringTransactions(req.user.sub);
    res.status(200).json({ recurring });
  } catch (error) {
    console.error('Error listing recurring transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /recurring:
 *   post:
 *     summary: Create a new recurring transaction
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecurringTransactionInput'
 *     responses:
 *       201:
 *         description: Recurring transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recurring:
 *                   $ref: '#/components/schemas/RecurringTransaction'
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req, res) => {
  const validationError = validateRecurringInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const recurring = await createRecurringTransaction(req.user.sub, req.body);
    res.status(201).json({ recurring });
  } catch (error) {
    console.error('Error creating recurring transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /recurring/run-due:
 *   post:
 *     summary: Execute all due recurring transactions
 *     description: Processes all recurring transactions that are due and creates corresponding actual transactions
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Due recurring transactions executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recurring transactions processed"
 *                 createdTransactions:
 *                   type: object
 *                   properties:
 *                     createdTransactions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *                     recurringTransactions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RecurringTransaction'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/run-due', async (req, res) => {
  try {
    const createdTransactions = await runDueRecurringTransactions(req.user.sub);
    res.status(200).json({ message: 'Recurring transactions processed', createdTransactions });
  } catch (error) {
    console.error('Error running recurring transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /recurring/{id}:
 *   put:
 *     summary: Update a recurring transaction
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recurring transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Monthly Rent"
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 1300.00
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: "expense"
 *               category:
 *                 type: string
 *                 example: "Housing"
 *               tags:
 *                 type: string
 *                 example: "monthly,rent"
 *               notes:
 *                 type: string
 *                 example: "Updated rent payment"
 *               recurringInterval:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *                 example: "monthly"
 *     responses:
 *       200:
 *         description: Recurring transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recurring:
 *                   $ref: '#/components/schemas/RecurringTransaction'
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
 *       404:
 *         description: Recurring transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const validationError = validateRecurringInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const recurring = await updateRecurringTransaction(req.user.sub, id, req.body);
    res.status(200).json({ recurring });
  } catch (error) {
    console.error('Error updating recurring transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /recurring/{id}:
 *   put:
 *     summary: Update a recurring transaction
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recurring transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecurringTransactionInput'
 *     responses:
 *       200:
 *         description: Recurring transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recurring:
 *                   $ref: '#/components/schemas/RecurringTransaction'
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
 *       404:
 *         description: Recurring transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /recurring/{id}:
 *   delete:
 *     summary: Delete a recurring transaction
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recurring transaction ID
 *     responses:
 *       204:
 *         description: Recurring transaction deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recurring transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteRecurringTransaction(req.user.sub, id);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting recurring transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;