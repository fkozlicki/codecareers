import MobileMenu from '@/components/mobile-menu';
import { navigationLinks } from '@/data/links';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithWrappers, user } from '../setup';

const openMenu = async () => {
	const menuButton = screen.getByTestId('mobile-menu-btn');
	const user = userEvent.setup();

	await user.click(menuButton);
};

describe('MobileMenu', () => {
	describe('Closed', () => {
		it('Should render trigger button', () => {
			renderWithWrappers(<MobileMenu />);

			const menuButton = screen.getByTestId('mobile-menu-btn');
			expect(menuButton).toBeInTheDocument();
		});
	});

	describe('Opened', () => {
		it('Should render logo and home link', async () => {
			renderWithWrappers(<MobileMenu />);

			await openMenu();

			const logo = screen.getByText(/CodeCareers/);
			const home = screen.getByText(/Home/);

			expect(logo).toBeInTheDocument();
			expect(home).toBeInTheDocument();
		});

		describe('Logged out', () => {
			beforeEach(async () => {
				renderWithWrappers(<MobileMenu />);
				await openMenu();
			});

			it('Should render Sign In and Sign Up buttons', () => {
				const signIn = screen.getByText(/Sign In/);
				const signUp = screen.getByText(/Sign Up/);

				expect(signIn).toBeInTheDocument();
				expect(signUp).toBeInTheDocument();
			});

			it('Should NOT render navigation links', () => {
				const username = screen.queryByTestId('username');

				expect(username).not.toBeInTheDocument();

				navigationLinks.forEach((link) => {
					expect(screen.queryByText(link.label)).not.toBeInTheDocument();
				});
			});
		});

		describe('Logged in', () => {
			beforeEach(async () => {
				renderWithWrappers(<MobileMenu />, {
					preloadedState: {
						auth: {
							user,
							status: 'authenticated',
						},
					},
				});

				await openMenu();
			});

			it('Should NOT render Sign In and Sign Up button', () => {
				const signIn = screen.queryByText(/Sign In/);
				const signUp = screen.queryByText(/Sign Up/);

				expect(signIn).not.toBeInTheDocument();
				expect(signUp).not.toBeInTheDocument();
			});

			it('Should render navigation links', () => {
				const username = screen.getByTestId('username');

				expect(username).toBeInTheDocument();

				navigationLinks.forEach((link) => {
					expect(screen.queryByText(link.label)).toBeInTheDocument();
				});
			});
		});
	});
});
