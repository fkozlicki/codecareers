import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/home.tsx';
import NotFound from './pages/404.tsx';
import Layout from './pages/layout.tsx';
import SignIn from './pages/sign-in.tsx';
import SignUp from './pages/sign-up.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import SessionProvider from './components/session-provider.tsx';
import Settings from './pages/settings.tsx';
import ProtectedRoute from './components/protected-route.tsx';
import Jobs from './pages/jobs.tsx';
import Companies from './pages/companies.tsx';
import CreateCompany from './pages/create-company.tsx';

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
				path: '/my-jobs',
				element: (
					<ProtectedRoute>
						<Jobs />
					</ProtectedRoute>
				),
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
				<RouterProvider router={router} />
			</SessionProvider>
		</Provider>
	</React.StrictMode>
);
