import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { PROVIDERS } from '../common/constants/providers';
import { Database } from '../providers/database/types';

@Injectable()
export class CronJobsRepository {
  constructor(@Inject(PROVIDERS.DATABASE) private readonly db: Kysely<Database>) {}

  async setAllBalances(amount: number): Promise<void> {
    await this.db
      .updateTable('users')
      .set({
        balance: amount,
      })
      .where('deleted_at', 'is', null)
      .execute();
  }
}
