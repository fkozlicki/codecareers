import Hero from '@/components/hero';
import { renderWithWrappers } from '../setup';
import { screen } from '@testing-library/dom';

beforeEach(() => {
	renderWithWrappers(<Hero />);

	screen.debug();
});

describe('Hero', () => {
	it('Should render logo', () => {
		expect(screen.queryByText('CodeCareers')).toBeInTheDocument();
	});
});
