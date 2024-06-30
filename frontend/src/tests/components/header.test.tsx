import Header from '@/components/header';
import { screen } from '@testing-library/dom';
import { renderWithWrappers, user } from '../setup';

describe('Header', () => {
	it('Should render logo and home link', () => {
		renderWithWrappers(<Header />);

		const logo = screen.getByText('CodeCareers');
		const home = screen.getByText('Home');

		expect(logo).toBeInTheDocument();
		expect(home).toBeInTheDocument();
	});

	describe('Logged out user', () => {
		beforeEach(() => {
			renderWithWrappers(<Header />);
		});

		it('Should NOT render HeaderDropdown', () => {
			const dropdownButton = screen.queryByTestId('user-dropdown-btn');

			expect(dropdownButton).not.toBeInTheDocument();
		});

		it('Should render Sign In and Sign Up buttons', () => {
			const signIn = screen.queryByText(/Sign In/);
			const signUp = screen.queryByText(/Sign Up/);

			expect(signIn).toBeInTheDocument();
			expect(signUp).toBeInTheDocument();
		});
	});

	describe('Logged in user', () => {
		beforeEach(() => {
			renderWithWrappers(<Header />, {
				preloadedState: {
					auth: {
						user,
						status: 'authenticated',
					},
				},
			});
		});

		it('Should render HeaderDropdown', () => {
			const dropdownButton = screen.queryByTestId('user-dropdown-btn');

			expect(dropdownButton).toBeInTheDocument();
		});
		it('Should NOT render Sign In and Sign Up buttons', () => {
			const signIn = screen.queryByText(/Sign In/);
			const signUp = screen.queryByText(/Sign Up/);

			expect(signIn).not.toBeInTheDocument();
			expect(signUp).not.toBeInTheDocument();
		});
	});
});
