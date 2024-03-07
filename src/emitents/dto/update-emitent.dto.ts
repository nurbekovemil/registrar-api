import { PartialType } from '@nestjs/swagger';
import { CreateEmitentDto } from './create-emitent.dto';

export class UpdateEmitentDto extends PartialType(CreateEmitentDto) {}
