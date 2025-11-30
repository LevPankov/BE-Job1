import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BalanceOperationsService } from './balance-operations.service';
import { SendMoneyDto } from './dto/send-money.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';

@Controller('balance-operations')
export class BalanceOperationsController {
  constructor(private readonly balanceOperationsService: BalanceOperationsService) {}

  @Post('send')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async sendMoney(@User('login') login: string, @Body() sendMoneyDto: SendMoneyDto): Promise<void> {
    return await this.balanceOperationsService.sendMoney(login, sendMoneyDto);
  }
}
