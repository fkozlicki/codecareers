import Search from '@/components/search';
import { renderWithWrappers } from '../setup';
import { fireEvent, screen } from '@testing-library/dom';

beforeEach(() => {
	renderWithWrappers(<Search />);

	screen.debug();
});

describe('Search', () => {
	it('Should render input and button', () => {
		expect(
			screen.getByPlaceholderText('Search for a job...')
		).toBeInTheDocument();
		expect(screen.getByText('Search')).toBeInTheDocument();
	});

	it('Should change input value after user types', async () => {
		const input = screen.getByPlaceholderText('Search for a job...');
		const userValue = 'React Developer';

		fireEvent.change(input, {
			target: {
				value: userValue,
			},
		});

		expect(input).toHaveValue(userValue);
	});
});
