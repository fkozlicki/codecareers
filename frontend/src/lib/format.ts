export const formatWorkType = (type: string) => {
	switch (type) {
		case 'full_time':
			return 'Full time';
		case 'part_time':
			return 'Part time';
		case 'internship':
			return 'Internship';
		case 'freelance':
			return 'Freelance';
		default:
			throw new Error('Invalid work type');
	}
};

export const formatEmploymentType = (type: string) => {
	switch (type) {
		case 'b2b':
			return 'B2B';
		case 'permanent':
			return 'Permanent';
		case 'internship':
			return 'Internship';
		case 'mandate':
			return 'Mandate contract';
		case 'task':
			return 'Task contract';
		default:
			throw new Error('Invalid employment type');
	}
};

export const formatCurrency = (value: number) => {
	return value.toLocaleString('en-US').replace(/,/g, ' ');
};
