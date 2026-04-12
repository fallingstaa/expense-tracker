export function validateCategoryCreateInput(body) {
	const { name } = body;

	if (!name || !String(name).trim()) {
		return 'name is required';
	}

	return null;
}

export function validateCategoryUpdateInput(body) {
	if (body.name !== undefined && !String(body.name).trim()) {
		return 'name cannot be empty';
	}

	return null;
}
