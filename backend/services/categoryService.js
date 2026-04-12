import { randomUUID } from 'crypto';
import supabase from '../utils/supabaseClient.js';
import { getSupabaseAdminClient } from '../utils/supabaseAdminClient.js';

const categoryStore = new Map();

function normalizeUserId(userId) {
	return String(userId);
}

function isSchemaError(error) {
	const message = String(error?.message || '').toLowerCase();
	return message.includes('does not exist') || message.includes('relation') || message.includes('schema cache') || message.includes('column') || error?.code === '42P01';
}

function getRows(userId) {
	const key = normalizeUserId(userId);
	if (!categoryStore.has(key)) {
		categoryStore.set(key, []);
	}

	return categoryStore.get(key);
}

function setRows(userId, rows) {
	categoryStore.set(normalizeUserId(userId), rows);
}

function normalizeCategory(row) {
	return {
		id: row.id,
		userId: row.user_id ?? row.userId,
		name: row.name,
		color: row.color ?? null,
		createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
		updatedAt: row.updated_at ?? row.updatedAt ?? row.created_at ?? new Date().toISOString()
	};
}

function getClient() {
	return getSupabaseAdminClient() ?? supabase;
}

export async function listCategories(userId) {
	const client = getClient();

	try {
		const { data, error } = await client.from('categories').select('*').eq('user_id', userId).order('created_at', { ascending: false });
		if (error) {
			throw error;
		}

		return (data ?? []).map(normalizeCategory);
	} catch (error) {
		// Return empty array instead of falling back to memory
		console.log('Database error for categories:', error.message);
		return [];
	}
}

export async function createCategory(userId, input) {
	const client = getClient();
	const record = {
		id: randomUUID(),
		user_id: userId,
		name: String(input.name).trim(),
		color: input.color ? String(input.color).trim() : null,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	};

	try {
		const { data, error } = await client.from('categories').insert(record).select('*').single();
		if (error) {
			throw error;
		}

		return { ...normalizeCategory(data), _storage: 'supabase' };
	} catch (error) {
		console.log('Database error for category creation:', error.message);
		throw new Error('Failed to create category - database tables may not exist');
	}
}

export async function updateCategory(userId, id, input) {
	const client = getClient();
	const patch = {
		...(input.name !== undefined ? { name: String(input.name).trim() } : {}),
		...(input.color !== undefined ? { color: input.color ? String(input.color).trim() : null } : {}),
		updated_at: new Date().toISOString()
	};

	try {
		const { data, error } = await client.from('categories').update(patch).eq('id', id).eq('user_id', userId).select('*').single();
		if (error) {
			throw error;
		}

		const rows = getRows(userId);
		const index = rows.findIndex(row => row.id === id);
		if (index >= 0) {
			rows[index] = { ...rows[index], ...patch };
			setRows(userId, rows);
		}

		return normalizeCategory(data);
	} catch (error) {
		if (isSchemaError(error)) {
			const rows = getRows(userId);
			const index = rows.findIndex(row => row.id === id);
			if (index === -1) {
				throw new Error('Category not found');
			}

			rows[index] = { ...rows[index], ...patch };
			setRows(userId, rows);
			return normalizeCategory(rows[index]);
		}

		throw error;
	}
}

export async function deleteCategory(userId, id) {
	const client = getClient();

	try {
		const { error } = await client.from('categories').delete().eq('id', id).eq('user_id', userId);
		if (error) {
			throw error;
		}
	} catch (error) {
		if (!isSchemaError(error)) {
			throw error;
		}
	}

	const rows = getRows(userId).filter(row => row.id !== id);
	setRows(userId, rows);
	return { message: 'Category deleted' };
}
