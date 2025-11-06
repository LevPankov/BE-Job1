import { Module } from '@nestjs/common';
import { CronJobsService } from './cron-jobs.service';
import { CronJobsRepository } from './cron-jobs.repository';
import { CronJobsController } from './cron-jobs.controller';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../common/constants/bull-queues';
import { BalancesProcessor } from './balances-queue.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.BALANCES,
    }),
  ],
  providers: [CronJobsService, CronJobsRepository, BalancesProcessor],
  controllers: [CronJobsController],
})
export class CronJobsModule {}
