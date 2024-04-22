import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
import dotnev from 'dotenv';

dotnev.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool, {
	schema,
});
