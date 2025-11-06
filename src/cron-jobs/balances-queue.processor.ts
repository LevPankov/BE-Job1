import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from '../common/constants/bull-queues';
import { CronJobsRepository } from './cron-jobs.repository';
import { Injectable, Logger } from '@nestjs/common';
import { BalanceSettingDto } from './dto/balance-setting.dto';

@Injectable()
@Processor(QUEUES.BALANCES)
export class BalancesProcessor extends WorkerHost {
  constructor(private readonly cronJobsRepository: CronJobsRepository) {
    super();
  }

  private readonly logger = new Logger(BalancesProcessor.name);

  async process(job: Job<BalanceSettingDto>): Promise<void> {
    await this.cronJobsRepository.setAllBalances(job.data.amount);
    this.logger.log('All balances setted to ' + job.data.amount);
  }
}
