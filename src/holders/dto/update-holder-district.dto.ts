import { PartialType } from '@nestjs/swagger';
import { CreateDistrictDto } from './create-holder-district.dto';

export class UpdateDistrictDto extends PartialType(CreateDistrictDto) {}
