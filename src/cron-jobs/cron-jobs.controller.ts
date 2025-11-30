import { Controller, Post } from '@nestjs/common';
import { CronJobsService } from './cron-jobs.service';

@Controller('cron-jobs')
export class CronJobsController {
  constructor(private readonly cronJobsService: CronJobsService) {}

  @Post('all-balances-to-default')
  async setAllBalances(): Promise<void> {
    return await this.cronJobsService.setAllBalancesToDefault();
  }
}
