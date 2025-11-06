import { Controller, Get } from '@nestjs/common';
import { CronJobsService } from './cron-jobs.service';

@Controller('cron-jobs')
export class CronJobsController {
  constructor(private readonly cronJobsService: CronJobsService) {}

  @Get('all-balances-to-default')
  setAllBalances(): void {
    this.cronJobsService.setAllBalancesToDefault();
  }
}
