import { sql } from 'drizzle-orm';
import { db } from '.';

export const clearDb = async () => {
	const query = sql<string>`SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'`;

	const tables = await db.execute(query);

	for (let table of tables.rows) {
		const query = sql.raw(
			`TRUNCATE TABLE public."${table.table_name}" CASCADE`
		);
		await db.execute(query);
	}
};
