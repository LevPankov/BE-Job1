import { UserBankInfo } from '../../common/interfaces/user-db-types';

export class FullSendOperationDto {
  senderData: UserBankInfo;

  receiverData: UserBankInfo;

  amount: number;
}
