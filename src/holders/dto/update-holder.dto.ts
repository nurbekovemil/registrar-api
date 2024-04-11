import { PartialType } from '@nestjs/swagger';
import { CreateHolderDto } from './create-holder.dto';

export class UpdateHolderDto extends PartialType(CreateHolderDto) {}
