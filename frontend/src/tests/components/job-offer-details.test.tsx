import { HttpResponse, delay, http } from 'msw';
import { jobOffers, seniorReactDeveloperDetailed } from '../data/jobOffers';
import { setupServer } from 'msw/node';
import { renderWithWrappers } from '../setup';
import JobOfferDetails from '@/components/job-offer-details';
import { screen, waitFor } from '@testing-library/dom';

const handlers = [
	http.get('/job-offers', async () => {
		await delay(100);
		return HttpResponse.json({
			jobOffers,
		});
	}),
	http.get('/job-offers/*', async () => {
		await delay(100);
		return HttpResponse.json({
			jobOffer: seniorReactDeveloperDetailed,
		});
	}),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('JobOfferDetails', () => {
	it('Should display job offer with its details', async () => {
		renderWithWrappers(<JobOfferDetails />);

		expect(
			screen.getByTestId('job-offer-details-skeleton')
		).toBeInTheDocument();

		screen.debug();

		await waitFor(() => {
			expect(
				screen.queryByText(seniorReactDeveloperDetailed.position)
			).toBeInTheDocument();
		});

		screen.debug();

		expect(
			screen.queryByTestId('job-offer-details-skeleton')
		).not.toBeInTheDocument();
	});
});
