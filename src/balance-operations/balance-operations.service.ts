import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BalanceOperationsRepository } from './balance-operations.repository';
import { SendMoneyDto } from './dto/send-money.dto';
import { FullSendOperationDto } from './dto/full-send-operation.dto';
import { NoResultError } from 'kysely';

@Injectable()
export class BalanceOperationsService {
  constructor(private readonly balanceOperationsRepository: BalanceOperationsRepository) {}

  private readonly logger = new Logger(BalanceOperationsService.name);

  async sendMoney(senderLogin: string, sendMoneyDto: SendMoneyDto): Promise<void> {
    try {
      const [senderData, receiverData] = await Promise.all([
        this.balanceOperationsRepository.getBankInfoByLogin(senderLogin),
        this.balanceOperationsRepository.getBankInfoByLogin(sendMoneyDto.receiverLogin),
      ]);
      const fullSendOperationDto: FullSendOperationDto = {
        senderData: senderData,
        receiverData: receiverData,
        amount: sendMoneyDto.amount,
      };
      await this.balanceOperationsRepository.transfermoney(fullSendOperationDto);
    } catch (er: unknown) {
      const error = er as Error;
      if (er instanceof NoResultError) {
        this.logger.error('User not found: ' + sendMoneyDto.receiverLogin);
        throw new NotFoundException('User not found');
      }
      if (error.message.search('users_balance_check')) {
        this.logger.error(senderLogin + " doesn't have enough money: " + sendMoneyDto.amount);
        throw new BadRequestException("You don't have enough money");
      }
      this.logger.error(error.message);
      throw new ConflictException(error?.message);
    }
    this.logger.log(senderLogin + ' sended ' + sendMoneyDto.amount + '$ to ' + sendMoneyDto.receiverLogin);
  }
}
