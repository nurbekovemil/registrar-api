import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('excel')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('import')
  async importAll() {
    return await this.seederService.processAllExcelFiles();
  }
}
