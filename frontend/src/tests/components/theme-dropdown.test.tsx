import ThemeDropdown from '@/components/theme-dropdown';
import { screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { renderWithWrappers } from '../setup';
import { useTheme } from 'next-themes';

const ThemeSpy = () => {
	const { theme } = useTheme();
	return <span data-testid="theme-spy">{theme + '-spy'}</span>;
};

beforeEach(async () => {
	renderWithWrappers(
		<>
			<ThemeSpy />
			<ThemeDropdown />
		</>
	);
});

const themes = ['Light', 'Dark', 'System'];

describe('ThemeDropdown', () => {
	describe('Closed', () => {
		it('Should render theme button', () => {
			expect(screen.queryByTestId('theme-btn')).toBeInTheDocument();
		});

		it('Should NOT render theme switch buttons', () => {
			themes.forEach((theme) => {
				expect(screen.queryByText(theme)).not.toBeInTheDocument();
			});
		});
	});

	describe('Opened', () => {
		beforeEach(async () => {
			const themeButton = screen.getByTestId('theme-btn');
			const user = userEvent.setup();

			await user.click(themeButton);
		});

		it('Should render theme switch buttons', () => {
			themes.forEach((theme) => {
				expect(screen.queryByText(theme)).toBeInTheDocument();
			});
		});

		it('Should change html tag class after clicking on theme switch button', async () => {
			const user = userEvent.setup();

			const spy = screen.getByTestId('theme-spy');
			expect(spy).toHaveTextContent('system-spy');

			const darkButton = screen.getByText('Dark');
			await user.click(darkButton);
			expect(spy).toHaveTextContent('dark-spy');

			const themeButton = screen.getByTestId('theme-btn');
			await user.click(themeButton);

			const lightButton = screen.getByText('Light');
			await user.click(lightButton);
			expect(spy).toHaveTextContent('light-spy');
		});
	});
});
