import { randomUUID } from 'crypto';
import supabase from '../utils/supabaseClient.js';
import { getSupabaseAdminClient } from '../utils/supabaseAdminClient.js';

const memoryStore = {
	transactions: new Map(),
	recurring: new Map(),
	budgets: new Map()
};

function normalizeUserId(userId) {
	return String(userId);
}

function isMissingTableError(error) {
	const message = String(error?.message || '').toLowerCase();
	return (
		message.includes('does not exist') ||
		message.includes('relation') ||
		message.includes('could not find') ||
		message.includes('schema cache') ||
		message.includes('column') ||
		error?.code === '42P01'
	);
}

function extractMissingColumnName(error) {
	const message = String(error?.message || '');
	const match = message.match(/'([^']+)'\s+column/i);
	if (!match) {
		return null;
	}

	return match[1];
}

function isUserForeignKeyError(error) {
	const message = String(error?.message || '').toLowerCase();
	return message.includes('transactions_user_id_fkey') || message.includes('foreign key constraint');
}

function getClient() {
	return getSupabaseAdminClient() ?? supabase;
}

async function ensurePublicUserRow(userId) {
	const adminClient = getSupabaseAdminClient();
	if (!adminClient) {
		return false;
	}

	const { data: authUserResult, error: authUserError } = await adminClient.auth.admin.getUserById(userId);
	if (authUserError || !authUserResult?.user) {
		return false;
	}

	let payload = {
		id: authUserResult.user.id,
		email: authUserResult.user.email,
		name: authUserResult.user.user_metadata?.name ?? null,
		password: 'supabase_auth_managed',
		updated_at: new Date().toISOString()
	};

	for (let attempt = 0; attempt < 5; attempt += 1) {
		const { error } = await adminClient.from('users').upsert(payload, { onConflict: 'id' });
		if (!error) {
			return true;
		}

		const missingColumn = extractMissingColumnName(error);
		if (missingColumn && Object.prototype.hasOwnProperty.call(payload, missingColumn)) {
			const { [missingColumn]: removedColumn, ...nextPayload } = payload;
			void removedColumn;
			payload = nextPayload;
			continue;
		}

		const message = String(error.message || '').toLowerCase();
		if (message.includes('does not exist') || message.includes('relation') || error.code === '42P01') {
			return false;
		}

		return false;
	}

	return false;
}

function toNumber(value, fallback = 0) {
	const numberValue = Number(value);
	return Number.isFinite(numberValue) ? numberValue : fallback;
}

function normalizeTags(tags) {
	if (Array.isArray(tags)) {
		return tags.map(tag => String(tag).trim()).filter(Boolean);
	}

	if (typeof tags === 'string') {
		return tags.split(',').map(tag => tag.trim()).filter(Boolean);
	}

	return [];
}

function parseDateValue(value, fallback = new Date()) {
	if (!value) {
		return fallback.toISOString();
	}

	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? fallback.toISOString() : date.toISOString();
}

function normalizeTransaction(row) {
	const normalizedCreatedAt = row.created_at ?? row.createdAt ?? row.date ?? new Date().toISOString();
	const normalizedUpdatedAt = row.updated_at ?? row.updatedAt ?? normalizedCreatedAt;
	const normalizedRecurringInterval = row.recurring_interval ?? row.recurringInterval ?? null;
	const normalizedBudgetLimit = row.budget_limit ?? row.budgetLimit ?? null;

	return {
		id: row.id,
		userId: row.user_id ?? row.userId,
		title: row.title,
		amount: toNumber(row.amount),
		type: row.type,
		category: row.category ?? null,
		tags: normalizeTags(row.tags),
		notes: row.notes ?? '',
		recurring: Boolean(row.recurring ?? false),
		recurringInterval: normalizedRecurringInterval,
		budgetLimit: normalizedBudgetLimit === null ? null : toNumber(normalizedBudgetLimit),
		date: normalizedCreatedAt,
		createdAt: normalizedCreatedAt,
		updatedAt: normalizedUpdatedAt
	};
}

function normalizeRecurring(row) {
	return {
		id: row.id,
		userId: row.user_id ?? row.userId,
		title: row.title,
		amount: toNumber(row.amount),
		type: row.type,
		category: row.category ?? null,
		tags: normalizeTags(row.tags),
		notes: row.notes ?? '',
		frequency: row.frequency ?? 'monthly',
		interval: toNumber(row.interval, 1),
		nextRunAt: row.next_run_at ?? row.nextRunAt ?? null,
		active: Boolean(row.active ?? true),
		createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
		updatedAt: row.updated_at ?? row.updatedAt ?? row.created_at ?? new Date().toISOString()
	};
}

function normalizeBudget(row) {
	return {
		id: row.id,
		userId: row.user_id ?? row.userId,
		category: row.category,
		limitAmount: toNumber(row.limit_amount ?? row.limitAmount),
		period: row.period ?? 'monthly',
		active: Boolean(row.active ?? true),
		createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
		updatedAt: row.updated_at ?? row.updatedAt ?? row.created_at ?? new Date().toISOString()
	};
}

function getMemoryCollection(collectionName, userId) {
	const normalizedUserId = normalizeUserId(userId);
	const collection = memoryStore[collectionName];

	if (!collection.has(normalizedUserId)) {
		collection.set(normalizedUserId, []);
	}

	return collection.get(normalizedUserId);
}

function setMemoryCollection(collectionName, userId, rows) {
	const normalizedUserId = normalizeUserId(userId);
	memoryStore[collectionName].set(normalizedUserId, rows);
	return rows;
}

function cloneRow(row) {
	return JSON.parse(JSON.stringify(row));
}

function getAdminClient() {
	return getSupabaseAdminClient() ?? supabase;
}

function buildTransactionRecord(userId, input) {
	const createdAt = parseDateValue(input.createdAt ?? input.date);
	const recurring = input.recurring === true;
	const recurringInterval = recurring && input.recurringInterval ? String(input.recurringInterval).trim() : null;
	const budgetLimit = input.budgetLimit === undefined || input.budgetLimit === null ? null : toNumber(input.budgetLimit);

	return {
		id: randomUUID(),
		user_id: userId,
		title: String(input.title).trim(),
		amount: toNumber(input.amount),
		type: String(input.type),
		category: input.category ? String(input.category).trim() : null,
		tags: normalizeTags(input.tags),
		notes: input.notes ? String(input.notes).trim() : '',
		recurring,
		recurring_interval: recurringInterval,
		budget_limit: budgetLimit,
		created_at: createdAt,
		updated_at: new Date().toISOString()
	};
}

function buildRecurringRecord(userId, input) {
	return {
		id: randomUUID(),
		user_id: userId,
		title: String(input.title).trim(),
		amount: toNumber(input.amount),
		type: String(input.type),
		category: input.category ? String(input.category).trim() : null,
		tags: normalizeTags(input.tags),
		notes: input.notes ? String(input.notes).trim() : '',
		frequency: String(input.frequency || 'monthly'),
		interval: Math.max(1, Math.floor(toNumber(input.interval, 1))),
		next_run_at: parseDateValue(input.nextRunAt),
		active: input.active === false ? false : true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	};
}

function buildBudgetRecord(userId, input) {
	return {
		id: input.id ?? randomUUID(),
		user_id: userId,
		category: String(input.category).trim(),
		limit_amount: toNumber(input.limitAmount),
		period: String(input.period || 'monthly'),
		active: input.active === false ? false : true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	};
}

function getPeriodRange(period = 'monthly') {
	const now = new Date();
	let end = new Date(now);
	let start;

	if (period === 'weekly') {
		const day = now.getUTCDay();
		const diff = day === 0 ? 6 : day - 1;
		start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diff, 0, 0, 0, 0));
		end.setUTCHours(23, 59, 59, 999);
		return { start: start.toISOString(), end: end.toISOString() };
	}

	start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
	end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
	return { start: start.toISOString(), end: end.toISOString() };
}

function rowMatchesFilters(row, filters = {}) {
	const normalizedType = filters.type ? String(filters.type).toLowerCase() : null;
	const normalizedCategory = filters.category ? String(filters.category).toLowerCase() : null;
	const normalizedDate = filters.date ? new Date(filters.date) : null;
	const startDate = filters.startDate ? new Date(filters.startDate) : null;
	const endDate = filters.endDate ? new Date(filters.endDate) : null;
	const search = filters.search ? String(filters.search).toLowerCase() : null;
	const tags = normalizeTags(filters.tags);
	const rowDate = new Date(row.createdAt ?? row.created_at ?? row.date ?? new Date().toISOString());

	if (normalizedType && String(row.type).toLowerCase() !== normalizedType) {
		return false;
	}

	if (normalizedCategory && String(row.category ?? '').toLowerCase() !== normalizedCategory) {
		return false;
	}

	if (normalizedDate && rowDate.toDateString() !== normalizedDate.toDateString()) {
		return false;
	}

	if (startDate && rowDate < startDate) {
		return false;
	}

	if (endDate && rowDate > endDate) {
		return false;
	}

	if (tags.length > 0) {
		const rowTags = normalizeTags(row.tags).map(tag => tag.toLowerCase());
		const hasTag = tags.some(tag => rowTags.includes(String(tag).toLowerCase()));
		if (!hasTag) {
			return false;
		}
	}

	if (search) {
		const haystack = [row.title, row.category, row.notes, normalizeTags(row.tags).join(' ')].join(' ').toLowerCase();
		if (!haystack.includes(search)) {
			return false;
		}
	}

	return true;
}

function sortRows(rows, sortBy = 'date', sortOrder = 'desc') {
	const normalizedSortBy = String(sortBy || 'createdAt');
	const direction = sortOrder === 'asc' ? 1 : -1;
	return [...rows].sort((left, right) => {
		let leftValue;
		let rightValue;

		if (normalizedSortBy === 'amount') {
			leftValue = toNumber(left.amount);
			rightValue = toNumber(right.amount);
		} else if (normalizedSortBy === 'updatedAt') {
			leftValue = new Date(left.updatedAt ?? left.updated_at ?? left.createdAt ?? left.created_at ?? 0).getTime();
			rightValue = new Date(right.updatedAt ?? right.updated_at ?? right.createdAt ?? right.created_at ?? 0).getTime();
		} else if (normalizedSortBy === 'type') {
			leftValue = String(left.type ?? '').toLowerCase();
			rightValue = String(right.type ?? '').toLowerCase();
		} else if (normalizedSortBy === 'category') {
			leftValue = String(left.category ?? '').toLowerCase();
			rightValue = String(right.category ?? '').toLowerCase();
		} else {
			leftValue = new Date(left.createdAt ?? left.created_at ?? left.date ?? 0).getTime();
			rightValue = new Date(right.createdAt ?? right.created_at ?? right.date ?? 0).getTime();
		}

		if (leftValue === rightValue) {
			return 0;
		}

		if (typeof leftValue === 'string' || typeof rightValue === 'string') {
			return String(leftValue).localeCompare(String(rightValue)) * direction;
		}

		return leftValue > rightValue ? direction : -direction;
	});
}

async function loadCollection(collectionName, userId, tableName, normalizer) {
	const adminClient = getAdminClient();
	const memoryRows = getMemoryCollection(collectionName, userId).map(cloneRow);

	try {
		const { data, error } = await adminClient.from(tableName).select('*').eq('user_id', userId);
		if (error) {
			throw error;
		}

		const dbRows = (data ?? []).map(normalizer);
		const mergedRows = new Map();

		for (const row of dbRows) {
			mergedRows.set(row.id, row);
		}

		for (const row of memoryRows.map(normalizer)) {
			mergedRows.set(row.id, row);
		}

		return [...mergedRows.values()];
	} catch (error) {
		if (!adminClient || isMissingTableError(error)) {
			return memoryRows.map(normalizer);
		}

		throw error;
	}
}

async function insertCollection(collectionName, userId, tableName, record, normalizer) {
	const adminClient = getAdminClient();

	try {
		const executeInsert = async () => {
			let payload = { ...record };
			let data;
			let error;

			for (let attempt = 0; attempt < 8; attempt += 1) {
				const result = await adminClient.from(tableName).insert(payload).select('*').single();
				data = result.data;
				error = result.error;

				if (!error) {
					break;
				}

				const missingColumn = extractMissingColumnName(error);
				if (missingColumn && Object.prototype.hasOwnProperty.call(payload, missingColumn)) {
					const { [missingColumn]: removedColumn, ...nextPayload } = payload;
					void removedColumn;
					payload = nextPayload;
					continue;
				}

				throw error;
			}

			if (error) {
				throw error;
			}

			return data;
		};

		let data;
		try {
			data = await executeInsert();
		} catch (firstInsertError) {
			if (tableName === 'transactions' && isUserForeignKeyError(firstInsertError)) {
				const repaired = await ensurePublicUserRow(userId);
				if (repaired) {
					data = await executeInsert();
				} else {
					throw firstInsertError;
				}
			} else {
				throw firstInsertError;
			}
		}

		const rows = getMemoryCollection(collectionName, userId);
		rows.unshift(record);
		setMemoryCollection(collectionName, userId, rows);

		return {
			...normalizer(data),
			_storage: 'supabase'
		};
	} catch (error) {
		if (!adminClient || isMissingTableError(error)) {
			const rows = getMemoryCollection(collectionName, userId);
			rows.unshift(record);
			setMemoryCollection(collectionName, userId, rows);
			return {
				...normalizer(record),
				_storage: 'memory-fallback'
			};
		}

		throw error;
	}
}

async function updateCollection(collectionName, userId, tableName, id, patch, normalizer) {
	const adminClient = getAdminClient();

	try {
		const { data, error } = await adminClient
			.from(tableName)
			.update(patch)
			.eq('id', id)
			.eq('user_id', userId)
			.select('*')
			.single();

		if (error) {
			throw error;
		}

		const rows = getMemoryCollection(collectionName, userId);
		const index = rows.findIndex(row => row.id === id);
		if (index >= 0) {
			rows[index] = {
				...rows[index],
				...patch,
				updated_at: new Date().toISOString()
			};
			setMemoryCollection(collectionName, userId, rows);
		}

		return normalizer(data);
	} catch (error) {
		if (!adminClient || isMissingTableError(error)) {
			const rows = getMemoryCollection(collectionName, userId);
			const index = rows.findIndex(row => row.id === id);
			if (index === -1) {
				throw new Error('Record not found');
			}

			const updatedRow = {
				...rows[index],
				...patch,
				updated_at: new Date().toISOString()
			};
			rows[index] = updatedRow;
			setMemoryCollection(collectionName, userId, rows);
			return normalizer(updatedRow);
		}

		throw error;
	}
}

async function deleteCollection(collectionName, userId, tableName, id) {
	const adminClient = getAdminClient();

	try {
		const { error } = await adminClient.from(tableName).delete().eq('id', id).eq('user_id', userId);
		if (error) {
			throw error;
		}

		const rows = getMemoryCollection(collectionName, userId);
		const nextRows = rows.filter(row => row.id !== id);
		setMemoryCollection(collectionName, userId, nextRows);

		return { message: 'Deleted successfully' };
	} catch (error) {
		if (!adminClient || isMissingTableError(error)) {
			const rows = getMemoryCollection(collectionName, userId);
			const nextRows = rows.filter(row => row.id !== id);
			setMemoryCollection(collectionName, userId, nextRows);
			return { message: 'Deleted successfully' };
		}

		throw error;
	}
}

async function getAllTransactions(userId) {
	return loadCollection('transactions', userId, 'transactions', normalizeTransaction);
}

async function getAllRecurring(userId) {
	return loadCollection('recurring', userId, 'recurring_transactions', normalizeRecurring);
}

async function getAllBudgets(userId) {
	return loadCollection('budgets', userId, 'budgets', normalizeBudget);
}

function summarizeTransactions(transactions, period) {
	const { start, end } = getPeriodRange(period);
	const startDate = new Date(start);
	const endDate = new Date(end);
	const scopedTransactions = transactions.filter(transaction => {
		const transactionDate = new Date(transaction.createdAt ?? transaction.created_at ?? transaction.date ?? new Date().toISOString());
		return transactionDate >= startDate && transactionDate <= endDate;
	});

	const totals = scopedTransactions.reduce(
		(accumulator, transaction) => {
			const amount = toNumber(transaction.amount);
			if (String(transaction.type) === 'income') {
				accumulator.income += amount;
			} else {
				accumulator.expense += amount;
			}
			return accumulator;
		},
		{ income: 0, expense: 0 }
	);

	const byCategory = scopedTransactions.reduce((accumulator, transaction) => {
		const category = transaction.category || 'Uncategorized';
		if (!accumulator[category]) {
			accumulator[category] = { income: 0, expense: 0, total: 0 };
		}

		const amount = toNumber(transaction.amount);
		if (String(transaction.type) === 'income') {
			accumulator[category].income += amount;
		} else {
			accumulator[category].expense += amount;
		}

		accumulator[category].total = accumulator[category].income - accumulator[category].expense;
		return accumulator;
	}, {});

	return {
		period,
		range: { start, end },
		totals: {
			income: totals.income,
			expense: totals.expense,
			balance: totals.income - totals.expense,
			count: scopedTransactions.length
		},
		byCategory,
		transactions: scopedTransactions.map(normalizeTransaction)
	};
}

function buildCsv(rows) {
	const headers = ['id', 'userId', 'title', 'amount', 'type', 'category', 'tags', 'notes', 'recurring', 'recurringInterval', 'budgetLimit', 'createdAt', 'updatedAt'];
	const escapeValue = value => {
		const text = Array.isArray(value) ? value.join('|') : String(value ?? '');
		return `"${text.replace(/"/g, '""')}"`;
	};

	const lines = [headers.join(',')];
	for (const row of rows) {
		lines.push(
			[
				row.id,
				row.userId,
				row.title,
				row.amount,
				row.type,
				row.category ?? '',
				normalizeTags(row.tags).join('|'),
				row.notes ?? '',
				row.recurring === true ? 'true' : 'false',
				row.recurringInterval ?? '',
				row.budgetLimit ?? '',
				row.createdAt ?? '',
				row.updatedAt ?? ''
			].map(escapeValue).join(',')
		);
	}

	return lines.join('\n');
}

function getBudgetForCategory(budgets, category, period) {
	const normalizedCategory = String(category).trim().toLowerCase();
	const normalizedPeriod = String(period || 'monthly').toLowerCase();
	return budgets.find(budget => String(budget.category).trim().toLowerCase() === normalizedCategory && String(budget.period).toLowerCase() === normalizedPeriod && budget.active !== false) || null;
}

function advanceDate(dateValue, frequency, interval) {
	const nextDate = new Date(dateValue);
	const step = Math.max(1, Number(interval) || 1);

	if (frequency === 'daily') {
		nextDate.setDate(nextDate.getDate() + step);
	} else if (frequency === 'weekly') {
		nextDate.setDate(nextDate.getDate() + step * 7);
	} else {
		nextDate.setMonth(nextDate.getMonth() + step);
	}

	return nextDate.toISOString();
}

async function getBudgetAlert(userId, transaction) {
	if (String(transaction.type) !== 'expense' || !transaction.category) {
		return null;
	}

	const budgets = await getAllBudgets(userId);
	const relevantBudget = getBudgetForCategory(budgets, transaction.category, 'monthly') || getBudgetForCategory(budgets, transaction.category, 'weekly');
	if (!relevantBudget) {
		return null;
	}

	const period = relevantBudget.period || 'monthly';
	const range = getPeriodRange(period);
	const periodTransactions = await listTransactions(userId, {
		type: 'expense',
		category: transaction.category,
		startDate: range.start,
		endDate: range.end,
		sortBy: 'createdAt',
		sortOrder: 'desc'
	});

	const spent = periodTransactions.reduce((accumulator, item) => accumulator + toNumber(item.amount), 0);
	const projected = spent + toNumber(transaction.amount);
	return {
		category: relevantBudget.category,
		period,
		limitAmount: relevantBudget.limitAmount,
		spent,
		projected,
		remaining: relevantBudget.limitAmount - projected,
		exceeded: projected > relevantBudget.limitAmount
	};
}

export async function listTransactions(userId, filters = {}) {
	const rows = await getAllTransactions(userId);
	const filteredRows = rows.filter(row => rowMatchesFilters(row, filters));
	const sortedRows = sortRows(filteredRows, filters.sortBy || 'createdAt', filters.sortOrder || 'desc');
	return sortedRows.map(normalizeTransaction);
}

export async function getTransactionById(userId, id) {
	const rows = await getAllTransactions(userId);
	const match = rows.find(row => row.id === id);
	return match ? normalizeTransaction(match) : null;
}

export async function createTransaction(userId, input) {
	const record = buildTransactionRecord(userId, input);
	const savedTransaction = await insertCollection('transactions', userId, 'transactions', record, normalizeTransaction);
	const budgetAlert = await getBudgetAlert(userId, savedTransaction);

	return {
		transaction: savedTransaction,
		budgetAlert
	};
}

export async function updateTransaction(userId, id, input) {
	const patch = {
		...(input.title !== undefined ? { title: String(input.title).trim() } : {}),
		...(input.amount !== undefined ? { amount: toNumber(input.amount) } : {}),
		...(input.type !== undefined ? { type: String(input.type) } : {}),
		...(input.category !== undefined ? { category: input.category ? String(input.category).trim() : null } : {}),
		...(input.tags !== undefined ? { tags: normalizeTags(input.tags) } : {}),
		...(input.notes !== undefined ? { notes: input.notes ? String(input.notes).trim() : '' } : {}),
		...(input.recurring !== undefined ? { recurring: input.recurring === true } : {}),
		...(input.recurringInterval !== undefined
			? { recurring_interval: input.recurringInterval ? String(input.recurringInterval).trim() : null }
			: {}),
		...(input.budgetLimit !== undefined
			? {
					budget_limit:
						input.budgetLimit === null || input.budgetLimit === '' ? null : toNumber(input.budgetLimit)
				}
			: {}),
		...(input.createdAt !== undefined ? { created_at: parseDateValue(input.createdAt) } : {}),
		...(input.date !== undefined ? { created_at: parseDateValue(input.date) } : {}),
		updated_at: new Date().toISOString()
	};

	const savedTransaction = await updateCollection('transactions', userId, 'transactions', id, patch, normalizeTransaction);
	const budgetAlert = await getBudgetAlert(userId, savedTransaction);

	return {
		transaction: savedTransaction,
		budgetAlert
	};
}

export async function deleteTransaction(userId, id) {
	return deleteCollection('transactions', userId, 'transactions', id);
}

export async function getTransactionsSummary(userId, period = 'monthly') {
	const transactions = await getAllTransactions(userId);
	return summarizeTransactions(transactions, period);
}

export async function listRecurringTransactions(userId) {
	const client = getClient();

	try {
		const { data, error } = await client.from('recurring_transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
		if (error) {
			throw error;
		}

		return (data ?? []).map(normalizeRecurring);
	} catch (error) {
		// Return empty array instead of falling back to memory
		console.log('Database error for recurring transactions:', error.message);
		return [];
	}
}

export async function createRecurringTransaction(userId, input) {
	const record = buildRecurringRecord(userId, input);
	const client = getClient();

	try {
		const { data, error } = await client
			.from('recurring_transactions')
			.insert(record)
			.select('*')
			.single();

		if (error) {
			throw error;
		}

		return {
			...normalizeRecurring(data),
			_storage: 'supabase'
		};
	} catch (error) {
		console.log('Database error for recurring transaction creation:', error.message);
		throw new Error('Failed to create recurring transaction - database tables may not exist');
	}
}

export async function updateRecurringTransaction(userId, id, input) {
	const patch = {
		...(input.title !== undefined ? { title: String(input.title).trim() } : {}),
		...(input.amount !== undefined ? { amount: toNumber(input.amount) } : {}),
		...(input.type !== undefined ? { type: String(input.type) } : {}),
		...(input.category !== undefined ? { category: input.category ? String(input.category).trim() : null } : {}),
		...(input.tags !== undefined ? { tags: normalizeTags(input.tags) } : {}),
		...(input.notes !== undefined ? { notes: input.notes ? String(input.notes).trim() : '' } : {}),
		...(input.frequency !== undefined ? { frequency: String(input.frequency) } : {}),
		...(input.interval !== undefined ? { interval: Math.max(1, Math.floor(toNumber(input.interval, 1))) } : {}),
		...(input.nextRunAt !== undefined ? { next_run_at: parseDateValue(input.nextRunAt) } : {}),
		...(input.active !== undefined ? { active: input.active === false ? false : true } : {}),
		updated_at: new Date().toISOString()
	};

	return updateCollection('recurring', userId, 'recurring_transactions', id, patch, normalizeRecurring);
}

export async function deleteRecurringTransaction(userId, id) {
	return deleteCollection('recurring', userId, 'recurring_transactions', id);
}

export async function runDueRecurringTransactions(userId) {
	const recurringTransactions = await getAllRecurring(userId);
	const now = new Date();
	const createdTransactions = [];
	const nextRecurringRows = [];

	for (const recurring of recurringTransactions) {
		const nextRunAt = new Date(recurring.nextRunAt);
		const isActive = recurring.active !== false;
		if (!isActive || Number.isNaN(nextRunAt.getTime()) || nextRunAt > now) {
			nextRecurringRows.push(recurring);
			continue;
		}

		const transactionInput = {
			title: recurring.title,
			amount: recurring.amount,
			type: recurring.type,
			category: recurring.category,
			tags: recurring.tags,
			notes: recurring.notes,
			date: nextRunAt.toISOString()
		};

		const createdTransaction = await createTransaction(userId, transactionInput);
		createdTransactions.push(createdTransaction.transaction);

		nextRecurringRows.push({
			...recurring,
			nextRunAt: advanceDate(nextRunAt, recurring.frequency, recurring.interval),
			updatedAt: new Date().toISOString()
		});
	}

	const adminClient = getAdminClient();
	try {
		if (adminClient) {
			const existingRows = await adminClient.from('recurring_transactions').select('*').eq('user_id', userId);
			if (!isMissingTableError(existingRows?.error)) {
				for (const recurring of nextRecurringRows) {
					await adminClient.from('recurring_transactions').upsert({
						id: recurring.id,
						user_id: userId,
						title: recurring.title,
						amount: recurring.amount,
						type: recurring.type,
						category: recurring.category,
						tags: recurring.tags,
						notes: recurring.notes,
						frequency: recurring.frequency,
						interval: recurring.interval,
						next_run_at: recurring.nextRunAt,
						active: recurring.active,
						updated_at: recurring.updatedAt ?? new Date().toISOString()
					});
				}
			}
		}
	} catch {
		setMemoryCollection('recurring', userId, nextRecurringRows.map(row => ({ ...row })));
	}

	setMemoryCollection('recurring', userId, nextRecurringRows.map(row => ({ ...row })));
	return {
		createdTransactions,
		recurringTransactions: nextRecurringRows.map(normalizeRecurring)
	};
}

export async function listBudgets(userId) {
	const client = getClient();

	try {
		const { data, error } = await client.from('budgets').select('*').eq('user_id', userId).order('created_at', { ascending: false });
		if (error) {
			throw error;
		}

		return (data ?? []).map(normalizeBudget);
	} catch (error) {
		// Return empty array instead of falling back to memory
		console.log('Database error for budgets:', error.message);
		return [];
	}
}

export async function getBudgetById(userId, id) {
	const client = getClient();

	try {
		const { data, error } = await client.from('budgets').select('*').eq('id', id).eq('user_id', userId).single();
		if (error) {
			throw error;
		}

		return normalizeBudget(data);
	} catch (error) {
		console.log('Database error for budget:', error.message);
		throw new Error('Budget not found');
	}
}

export async function updateBudget(userId, id, input) {
	const client = getClient();
	const patch = {
		...(input.category !== undefined ? { category: String(input.category).trim() } : {}),
		...(input.limitAmount !== undefined ? { limit_amount: toNumber(input.limitAmount) } : {}),
		...(input.period !== undefined ? { period: String(input.period).trim() } : {}),
		...(input.active !== undefined ? { active: Boolean(input.active) } : {}),
		updated_at: new Date().toISOString()
	};

	try {
		const { data, error } = await client.from('budgets').update(patch).eq('id', id).eq('user_id', userId).select('*').single();
		if (error) {
			throw error;
		}

		return normalizeBudget(data);
	} catch (error) {
		console.log('Database error for budget update:', error.message);
		throw new Error('Failed to update budget');
	}
}

export async function createOrUpdateBudget(userId, input) {
	const record = buildBudgetRecord(userId, input);
	const client = getClient();

	try {
		// Check for existing budget in database
		const { data: existingBudgets, error: fetchError } = await client
			.from('budgets')
			.select('*')
			.eq('user_id', userId)
			.ilike('category', record.category)
			.eq('period', record.period);

		if (fetchError) {
			throw fetchError;
		}

		const match = existingBudgets?.[0];

		if (!match) {
			// Create new budget
			const { data, error } = await client
				.from('budgets')
				.insert(record)
				.select('*')
				.single();

			if (error) {
				throw error;
			}

			return {
				...normalizeBudget(data),
				_storage: 'supabase'
			};
		} else {
			// Update existing budget
			const patch = {
				category: record.category,
				limit_amount: record.limit_amount,
				period: record.period,
				active: record.active,
				updated_at: new Date().toISOString()
			};

			const { data, error } = await client
				.from('budgets')
				.update(patch)
				.eq('id', match.id)
				.eq('user_id', userId)
				.select('*')
				.single();

			if (error) {
				throw error;
			}

			return normalizeBudget(data);
		}
	} catch (error) {
		console.log('Database error for budget operation:', error.message);
		throw new Error('Failed to create or update budget - database tables may not exist');
	}
}

export async function checkBudgetLimit(userId, input) {
	const amount = toNumber(input.amount);
	const category = String(input.category).trim();
	const type = String(input.type || 'expense');

	if (type !== 'expense') {
		return {
			exceeded: false,
			message: 'Income transactions do not trigger budget alerts'
		};
	}

	const budgets = await listBudgets(userId);
	const budget = getBudgetForCategory(budgets, category, input.period || 'monthly');

	if (!budget) {
		return {
			exceeded: false,
			message: 'No active budget found for this category'
		};
	}

	const range = getPeriodRange(budget.period || input.period || 'monthly');
	const transactions = await listTransactions(userId, {
		type: 'expense',
		category,
		startDate: range.start,
		endDate: range.end
	});
	const spent = transactions.reduce((sum, transaction) => sum + toNumber(transaction.amount), 0);
	const projected = spent + amount;

	return {
		budget,
		spent,
		projected,
		remaining: budget.limitAmount - projected,
		exceeded: projected > budget.limitAmount,
		message: projected > budget.limitAmount ? 'Budget limit exceeded' : 'Within budget'
	};
}

export async function deleteBudget(userId, id) {
	return deleteCollection('budgets', userId, 'budgets', id);
}

export async function exportTransactionsData(userId, query = {}) {
	const transactions = await listTransactions(userId, query);
	const format = String(query.format || 'json').toLowerCase();

	if (format === 'csv') {
		const headers = ['id', 'userId', 'title', 'amount', 'type', 'category', 'tags', 'notes', 'recurring', 'recurringInterval', 'budgetLimit', 'createdAt', 'updatedAt'];
		const escapeValue = value => {
			const text = Array.isArray(value) ? value.join('|') : String(value ?? '');
			return `"${text.replace(/"/g, '""')}"`;
		};

		const lines = [headers.join(',')];
		for (const row of transactions) {
			lines.push(
				[
					row.id,
					row.userId,
					row.title,
					row.amount,
					row.type,
					row.category ?? '',
					normalizeTags(row.tags).join('|'),
					row.notes ?? '',
					row.recurring === true ? 'true' : 'false',
					row.recurringInterval ?? '',
					row.budgetLimit ?? '',
					row.createdAt ?? '',
					row.updatedAt ?? ''
				].map(escapeValue).join(',')
			);
		}

		return {
			format: 'csv',
			contentType: 'text/csv',
			body: lines.join('\n')
		};
	}

	return {
		format: 'json',
		contentType: 'application/json',
		body: transactions
	};
}
