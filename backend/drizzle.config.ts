import type { Config } from 'drizzle-kit';
import dotnev from 'dotenv';

dotnev.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

export default {
	schema: './src/db/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!,
	},
} satisfies Config;
