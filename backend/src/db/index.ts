import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import dotnev from 'dotenv';
import * as schema from './schema/index.js';

dotnev.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool, {
	schema,
});
