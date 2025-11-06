import { Module } from '@nestjs/common';
import { BalanceOperationsController } from './balance-operations.controller';
import { BalanceOperationsService } from './balance-operations.service';
import { BalanceOperationsRepository } from './balance-operations.repository';

@Module({
  controllers: [BalanceOperationsController],
  providers: [BalanceOperationsService, BalanceOperationsRepository],
})
export class BalanceOperationsModule {}
