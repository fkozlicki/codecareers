import JobOffersPanel from '@/components/job-offers-panel';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { HttpResponse, delay, http } from 'msw';
import { setupServer } from 'msw/node';
import {
	jobOffers,
	juniorBackendDeveloperDetailed,
	seniorReactDeveloperDetailed,
} from '../data/jobOffers';
import { renderWithWrappers } from '../setup';

const handlers = [
	http.get('/job-offers', async () => {
		await delay(100);
		return HttpResponse.json({
			jobOffers,
		});
	}),
	http.get('/job-offers/:id', async ({ params: { id } }) => {
		await delay(100);
		if (id === seniorReactDeveloperDetailed.id) {
			return HttpResponse.json({
				jobOffer: seniorReactDeveloperDetailed,
			});
		} else if (id === juniorBackendDeveloperDetailed.id) {
			return HttpResponse.json({
				jobOffer: juniorBackendDeveloperDetailed,
			});
		} else {
			return HttpResponse.json(null, { status: 404 });
		}
	}),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('JobOffersPanel', () => {
	it('Should change displayed JobOffer on JobOfferPreview click', async () => {
		renderWithWrappers(<JobOffersPanel />);

		// Display list of JobOfferCard
		const cards = await screen.findAllByTestId('job-offer-card');
		cards.forEach((el) => expect(el).toBeInTheDocument());

		// Display JobOfferDetails
		let jobOfferDetails = await screen.findByTestId('job-offer-details');
		expect(jobOfferDetails).toHaveTextContent(jobOffers[0].position);

		// Click second JobOffer
		fireEvent.click(cards[1]);

		// Wait for the loading skeleton to appear and then disappear
		await waitFor(() => {
			expect(
				screen.queryByTestId('job-offer-details-skeleton')
			).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(
				screen.queryByTestId('job-offer-details-skeleton')
			).not.toBeInTheDocument();
		});

		// Display second JobOffer
		jobOfferDetails = await screen.findByTestId('job-offer-details');
		expect(jobOfferDetails).toHaveTextContent(jobOffers[1].position);

		// Click first JobOffer
		fireEvent.click(cards[0]);

		// Display first JobOffer
		expect(jobOfferDetails).toHaveTextContent(jobOffers[0].position);
	});
});
