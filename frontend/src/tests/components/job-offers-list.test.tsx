import JobOffersList from '@/components/job-offers-list';
import { screen, waitFor } from '@testing-library/dom';
import { HttpResponse, delay, http } from 'msw';
import { setupServer } from 'msw/node';
import { jobOffers } from '../data/jobOffers';
import { renderWithWrappers } from '../setup';

const handlers = [
	http.get('/job-offers', async () => {
		await delay(100);
		return HttpResponse.json({
			jobOffers,
		});
	}),
];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

describe('JobOffersList', () => {
	it('Should display list of job offers', async () => {
		renderWithWrappers(<JobOffersList />);

		screen.getAllByTestId('job-offer-skeleton').forEach((el) => {
			expect(el).toBeInTheDocument();
		});

		screen.debug();

		await waitFor(() => {
			jobOffers.forEach(({ position }) => {
				expect(screen.getByText(position)).toBeInTheDocument();
			});
		});

		screen.debug();

		screen.queryAllByTestId('job-offer-skeleton').forEach((el) => {
			expect(el).not.toBeInTheDocument();
		});
	});
});
