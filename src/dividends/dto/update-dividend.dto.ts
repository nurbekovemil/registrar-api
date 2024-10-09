import { PartialType } from '@nestjs/swagger';
import { CreateDividendDto } from './create-dividend.dto';

export class UpdateDividendDto extends PartialType(CreateDividendDto) {}
