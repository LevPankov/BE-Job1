import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { PROVIDERS } from '../common/constants/providers';
import { Database } from '../providers/database/types';
import { UserBankInfo } from 'src/common/interfaces/user-db-types';
import { FullSendOperationDto } from './dto/full-send-operation.dto';

@Injectable()
export class BalanceOperationsRepository {
  constructor(@Inject(PROVIDERS.DATABASE) private readonly db: Kysely<Database>) {}

  async getBankInfoByLogin(login: string): Promise<UserBankInfo> {
    return await this.db
      .selectFrom('users')
      .select(['id', 'login', 'age', 'balance'])
      .where('login', '=', login)
      .where('deleted_at', 'is', null)
      .executeTakeFirstOrThrow();
  }

  async transfermoney(data: FullSendOperationDto): Promise<void> {
    return await this.db.transaction().execute(async (transaction) => {
      await transaction
        .updateTable('users')
        .set({
          balance: data.senderData.balance - data.amount,
        })
        .where('login', '=', data.senderData.login)
        .where('deleted_at', 'is', null)
        .executeTakeFirstOrThrow();

      await transaction
        .updateTable('users')
        .set({
          balance: Number(data.receiverData.balance) + data.amount,
        })
        .where('login', '=', data.receiverData.login)
        .where('deleted_at', 'is', null)
        .executeTakeFirstOrThrow();
    });
  }
}
