import { CreateAccountTypeDto } from './create-type-account.dto';
import { PartialType } from '@nestjs/swagger';


export class UpdateAccountTypeDto extends PartialType(CreateAccountTypeDto) {}
