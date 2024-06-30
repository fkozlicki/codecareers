import { AppStore, RootState, setupStore } from '@/app/store';
import * as matchers from '@testing-library/jest-dom/matchers';
import { RenderOptions, cleanup, render } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect } from 'vitest';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

expect.extend(matchers);

afterEach(() => {
	cleanup();
});

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
	preloadedState?: Partial<RootState>;
	store?: AppStore;
}

export const renderWithWrappers = (
	component: ReactNode,
	{
		preloadedState = {},
		store = setupStore(preloadedState),
		...renderOptions
	}: ExtendedRenderOptions = {}
) => {
	render(component, {
		wrapper: ({ children }) => (
			<MemoryRouter>
				<Provider store={store}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{children}
					</ThemeProvider>
				</Provider>
			</MemoryRouter>
		),
		...renderOptions,
	});

	return { store };
};

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

const IntersectionObserverMock = vi.fn(() => ({
	disconnect: vi.fn(),
	observe: vi.fn(),
	takeRecords: vi.fn(),
	unobserve: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

export const user = {
	avatar: null,
	id: '123',
	firstName: 'John',
	lastName: 'Doe',
};
