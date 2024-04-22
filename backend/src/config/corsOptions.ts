import { CorsOptions } from 'cors';
import { allowedOrigins } from './allowedOrigins.js';

export const corsOptions: CorsOptions = {
	credentials: true,
	origin(requestOrigin, callback) {
		if (!requestOrigin || allowedOrigins.indexOf(requestOrigin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	optionsSuccessStatus: 200,
};
