import { Body, Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('import')
  async importAll() {
    return await this.seederService.processAllExcelFiles();
  }

  @Post('insert')
  async insertAll(@Body() body: any) {
    return await this.seederService.insertAllData(body);
  }

    @Post('core')
  async core(@Body() body: any) {
    return await this.seederService.core(body);
  }
}
