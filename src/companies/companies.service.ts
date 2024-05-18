import { Injectable } from '@nestjs/common';
import { Company } from './entities/company.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company) private companyRepository: typeof Company,
  ){}
  async findOne(id: number) {
    const company = await this.companyRepository.findByPk(id)
    return company
  }
}
