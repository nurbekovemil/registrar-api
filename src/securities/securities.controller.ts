import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SecuritiesService } from './securities.service';
import { CreateSecurityDto } from './dto/create-security.dto';

@Controller('securities')
export class SecuritiesController {
  constructor(private readonly securitiesService: SecuritiesService) {}

  @Post()
  create(@Body() createSecurityDto: CreateSecurityDto) {
    return this.securitiesService.createSecurity(createSecurityDto);
  }



}
