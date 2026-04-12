function parseNumber(value) {
	const numberValue = Number(value);
	return Number.isFinite(numberValue) ? numberValue : null;
}

function validateDateValue(value, fieldName) {
	if (!value) {
		return null;
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return `${fieldName} must be a valid date`;
	}

	return null;
}

export function validateTransactionCreateInput(body) {
	const { title, amount, type } = body;

	if (!title || !String(title).trim()) {
		return 'title is required';
	}

	if (parseNumber(amount) === null) {
		return 'amount must be a valid number';
	}

	if (!['income', 'expense'].includes(String(type))) {
		return 'type must be income or expense';
	}

	const dateError = validateDateValue(body.date, 'date');
	if (dateError) {
		return dateError;
	}

	const createdAtError = validateDateValue(body.createdAt, 'createdAt');
	if (createdAtError) {
		return createdAtError;
	}

	if (body.recurring !== undefined && typeof body.recurring !== 'boolean') {
		return 'recurring must be a boolean';
	}

	if (body.recurringInterval !== undefined && body.recurringInterval !== null && !String(body.recurringInterval).trim()) {
		return 'recurringInterval cannot be empty';
	}

	if (body.budgetLimit !== undefined && body.budgetLimit !== null && parseNumber(body.budgetLimit) === null) {
		return 'budgetLimit must be a valid number';
	}

	return null;
}

export function validateTransactionUpdateInput(body) {
	if (body.title !== undefined && !String(body.title).trim()) {
		return 'title cannot be empty';
	}

	if (body.amount !== undefined && parseNumber(body.amount) === null) {
		return 'amount must be a valid number';
	}

	if (body.type !== undefined && !['income', 'expense'].includes(String(body.type))) {
		return 'type must be income or expense';
	}

	const dateError = validateDateValue(body.date, 'date');
	if (dateError) {
		return dateError;
	}

	const createdAtError = validateDateValue(body.createdAt, 'createdAt');
	if (createdAtError) {
		return createdAtError;
	}

	if (body.recurring !== undefined && typeof body.recurring !== 'boolean') {
		return 'recurring must be a boolean';
	}

	if (body.recurringInterval !== undefined && body.recurringInterval !== null && !String(body.recurringInterval).trim()) {
		return 'recurringInterval cannot be empty';
	}

	if (body.budgetLimit !== undefined && body.budgetLimit !== null && parseNumber(body.budgetLimit) === null) {
		return 'budgetLimit must be a valid number';
	}

	return null;
}

export function validateTransactionFilterQuery(query) {
	const allowedSortFields = ['date', 'amount', 'createdAt', 'updatedAt', 'type', 'category'];
	if (query.sortBy && !allowedSortFields.includes(String(query.sortBy))) {
		return 'sortBy must be one of date, amount, createdAt, updatedAt, type, or category';
	}

	if (query.sortOrder && !['asc', 'desc'].includes(String(query.sortOrder))) {
		return 'sortOrder must be asc or desc';
	}

	const dateFields = ['startDate', 'endDate', 'date'];
	for (const fieldName of dateFields) {
		const dateError = validateDateValue(query[fieldName], fieldName);
		if (dateError) {
			return dateError;
		}
	}

	return null;
}

export function validateSummaryQuery(query) {
	if (query.period && !['weekly', 'monthly'].includes(String(query.period))) {
		return 'period must be weekly or monthly';
	}

	return null;
}

export function validateRecurringInput(body) {
	const { title, amount, type, frequency } = body;

	if (!title || !String(title).trim()) {
		return 'title is required';
	}

	if (parseNumber(amount) === null) {
		return 'amount must be a valid number';
	}

	if (!['income', 'expense'].includes(String(type))) {
		return 'type must be income or expense';
	}

	if (!['daily', 'weekly', 'monthly'].includes(String(frequency || 'monthly'))) {
		return 'frequency must be daily, weekly, or monthly';
	}

	const dateError = validateDateValue(body.nextRunAt, 'nextRunAt');
	if (dateError) {
		return dateError;
	}

	return null;
}

export function validateBudgetInput(body) {
	const { category, limitAmount } = body;

	if (!category || !String(category).trim()) {
		return 'category is required';
	}

	if (parseNumber(limitAmount) === null) {
		return 'limitAmount must be a valid number';
	}

	return null;
}

export function validateBudgetUpdateInput(body) {
	const { category, limitAmount, period, active } = body;

	// All fields are optional for updates
	if (category !== undefined && (!category || !String(category).trim())) {
		return 'category cannot be empty if provided';
	}

	if (limitAmount !== undefined && parseNumber(limitAmount) === null) {
		return 'limitAmount must be a valid number if provided';
	}

	if (period !== undefined && !['weekly', 'monthly'].includes(period)) {
		return 'period must be either "weekly" or "monthly" if provided';
	}

	if (active !== undefined && typeof active !== 'boolean') {
		return 'active must be a boolean if provided';
	}

	return null;
}

export function validateBudgetCheckInput(body) {
	const { category, amount } = body;

	if (!category || !String(category).trim()) {
		return 'category is required';
	}

	if (parseNumber(amount) === null) {
		return 'amount must be a valid number';
	}

	return null;
}

export function validateExportQuery(query) {
	if (query.format && !['json', 'csv'].includes(String(query.format))) {
		return 'format must be json or csv';
	}

	return validateTransactionFilterQuery(query);
}
