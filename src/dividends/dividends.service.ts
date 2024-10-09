import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDividendDto } from './dto/create-dividend.dto';
import { UpdateDividendDto } from './dto/update-dividend.dto';
import { Dividend } from './entities/dividend.entity';
import { InjectModel } from '@nestjs/sequelize';
import { SecuritiesService } from 'src/securities/securities.service';
import sequelize from 'sequelize';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Holder } from 'src/holders/entities/holder.entity';

@Injectable()
export class DividendsService {
  constructor(
    @InjectModel(Dividend) private dividendRepository: typeof Dividend,
    private securityService: SecuritiesService,
  ){}
  async createDividend(createDividendDto: CreateDividendDto) {
    try {
      const shareholders = await this.securityService.getEmitentHolders(createDividendDto.emitent_id);
      if (!shareholders.length) {
        throw new HttpException('Акционеры не найдены', HttpStatus.NOT_FOUND);
      }
      const existDividend = await this.dividendRepository.findOne({
        where: {
          emitent_id: createDividendDto.emitent_id,
          date_payment: createDividendDto.date_payment
        }
      })
      if (existDividend) {
        throw new HttpException('Дивиденд по этой дате уже существует', HttpStatus.BAD_REQUEST);
      }
      const createDividendPromises = shareholders.map(async (shareholder) => {
        const share_count = shareholder.quantity;
        const share_credited = shareholder.quantity * createDividendDto.share_price;
        const share_debited = 0.00;
        const amount_pay = share_credited;
        const date_payment = createDividendDto.date_payment;
  
        return this.dividendRepository.create({
          holder_id: shareholder.holder_id,
          emitent_id: createDividendDto.emitent_id,
          share_count,
          share_credited,
          share_debited,
          amount_pay,
          date_payment,
        });
      });
  
      const dividendTrnsaction = await Promise.all(createDividendPromises);
      return dividendTrnsaction;
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async getAllDividends(eid: number) {
    return await this.dividendRepository.findAll({
      attributes: [
        'date_payment',
        [sequelize.fn('SUM', sequelize.col('amount_pay')), 'total_amount'],
      ],
      where: {
        emitent_id: eid
      },
      group: [
        'Dividend.emitent_id', 
        'Dividend.date_payment',
      ],
    });
  }

  async getDividendsByDate(eid: number, date: string) {
    return await this.dividendRepository.findAll({
      where: {
        emitent_id: eid,
        date_payment: date
      },
      include: [
        {
          model: Holder,
          attributes: ['id', 'name']
        }
      ]
    });
  }
}
