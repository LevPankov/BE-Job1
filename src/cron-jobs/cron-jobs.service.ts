import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUES } from '../common/constants/bull-queues';
import { BalanceSettingDto } from './dto/balance-setting.dto';

const DEFAULT_AMOUNT = 10;

@Injectable()
export class CronJobsService {
  constructor(@InjectQueue(QUEUES.BALANCES) private balancesQueue: Queue) {}

  private readonly logger = new Logger(CronJobsService.name);

  @Cron('0 */10 * * * *')
  async setAllBalancesToDefault(): Promise<void> {
    const balanceSettingDto: BalanceSettingDto = { amount: DEFAULT_AMOUNT };
    this.logger.log('Adding job of setting all balances to ' + DEFAULT_AMOUNT + '$');
    await this.balancesQueue.add('setToDefault', balanceSettingDto);
  }
}
