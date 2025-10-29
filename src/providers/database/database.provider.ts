import { Provider } from '@nestjs/common';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './types';
import { PROVIDERS } from '../../common/constants/providers';

export const KyselyProvider: Provider = {
  provide: PROVIDERS.DATABASE, // Уникальный токен для инъекции
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
