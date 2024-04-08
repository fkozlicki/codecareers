import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { store } from './app/store.ts';
import ProtectedRoute from './components/protected-route.tsx';
import SessionProvider from './components/session-provider.tsx';
import './index.css';
import NotFound from './pages/404.tsx';
import Applications from './pages/applications.tsx';
import Companies from './pages/companies.tsx';
import CompanyLayout from './pages/company-layout.tsx';
import Company from './pages/company.tsx';
import CreateCompany from './pages/create-company.tsx';
import CreateJobOffer from './pages/create-job-offer.tsx';
import Home from './pages/home.tsx';
import CompanyJobOffers from './pages/company-job-offers.tsx';
import Layout from './pages/layout.tsx';
import Recruitments from './pages/recruitments.tsx';
import Settings from './pages/settings.tsx';
import SignIn from './pages/sign-in.tsx';
import SignUp from './pages/sign-up.tsx';
import ApplicationsLayout from './pages/applications-layout.tsx';
import CompanyJobOffer from './pages/company-job-offer.tsx';
import EditJobOffer from './pages/edit-job-offer.tsx';
import { ThemeProvider } from 'next-themes';

const router = createBrowserRouter([
	{
		path: '',
		element: <Layout />,
		errorElement: <NotFound />,
		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/settings',
				element: (
					<ProtectedRoute>
						<Settings />
					</ProtectedRoute>
				),
			},
			{
				path: '/my-applications',
				element: (
					<ProtectedRoute>
						<ApplicationsLayout />
					</ProtectedRoute>
				),
				children: [
					{
						path: '',
						element: <Applications />,
					},
				],
			},
			{
				path: '/my-companies',
				element: (
					<ProtectedRoute>
						<Companies />
					</ProtectedRoute>
				),
			},
			{
				path: '/my-companies/create',
				element: (
					<ProtectedRoute>
						<CreateCompany />
					</ProtectedRoute>
				),
			},
			{
				path: '/my-companies/:id',
				element: <CompanyLayout />,
				children: [
					{
						path: '',
						element: (
							<ProtectedRoute>
								<Company />
							</ProtectedRoute>
						),
					},
					{
						path: 'job-offers',
						children: [
							{
								path: '',
								element: (
									<ProtectedRoute>
										<CompanyJobOffers />
									</ProtectedRoute>
								),
							},
							{
								path: 'create',
								element: <CreateJobOffer />,
							},
							{
								path: ':jobOfferId',
								children: [
									{
										path: '',
										element: <CompanyJobOffer />,
									},
									{
										path: 'edit',
										element: <EditJobOffer />,
									},
								],
							},
						],
					},
					{
						path: 'recruitments',
						element: (
							<ProtectedRoute>
								<Recruitments />
							</ProtectedRoute>
						),
					},
				],
			},
		],
	},
	{
		path: '/signin',
		element: <SignIn />,
	},
	{
		path: '/signup',
		element: <SignUp />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<SessionProvider>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<RouterProvider router={router} />
				</ThemeProvider>
			</SessionProvider>
		</Provider>
	</React.StrictMode>
);
