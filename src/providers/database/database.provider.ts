import { Provider } from '@nestjs/common';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './types';

export const KyselyProvider: Provider = {
  provide: 'KYSELY_DB', // Уникальный токен для инъекции
  useFactory: () => {
    return new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.DATABASE_URL,
        }),
      }),
    });
  },
};
