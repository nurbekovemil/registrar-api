import { Injectable } from '@nestjs/common';
import { CreateSecurityDto } from './dto/create-security.dto';
import { UpdateSecurityDto } from './dto/update-security.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Security } from './entities/security.entity';

@Injectable()
export class SecuritiesService {
  constructor(
    @InjectModel(Security) private securityRepository: typeof Security,
  ) {}

  create(createSecurityDto: CreateSecurityDto) {
    return 'This action adds a new security';
  }

  findAll() {
    return `This action returns all securities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} security`;
  }

  update(id: number, updateSecurityDto: UpdateSecurityDto) {
    return `This action updates a #${id} security`;
  }

  remove(id: number) {
    return `This action removes a #${id} security`;
  }

  async createSecurityAttitude(securityAttitudeDto: {name: string}){
    
  }
  async getSecurityAttitudes(){

  }

  async getSecuritiesByHolderId(holder_id: number) {
    const securities  = await this.securityRepository.findAll({
      where: { holder_id },
    });
    return securities
  }
}
