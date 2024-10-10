import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDividendDto } from './dto/create-dividend.dto';
import { UpdateDividendDto } from './dto/update-dividend.dto';
import { Dividend } from './entities/dividend.entity';
import { DividendTransaction } from './entities/dividend-transaction.entity';
import { InjectModel } from '@nestjs/sequelize';
import { SecuritiesService } from 'src/securities/securities.service';
import sequelize from 'sequelize';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import { HolderType } from 'src/holders/entities/holder-type.entity';

@Injectable()
export class DividendsService {
  constructor(
    @InjectModel(Dividend) private dividendRepository: typeof Dividend,
    @InjectModel(DividendTransaction) private dividendTransactionRepository: typeof DividendTransaction,
    private securityService: SecuritiesService,
  ){}
  async createDividend(createDividendDto: CreateDividendDto) {
    try {
      const shareholders = await this.securityService.getEmitentHoldersByHolderType(createDividendDto.emitent_id, createDividendDto.type);
      if (!shareholders.length) {
        throw new HttpException('Акционеры не найдены', HttpStatus.NOT_FOUND);
      }
      const amount_share = shareholders.reduce((acc, item) => acc + item.quantity, 0);
      const amount_share_credited = amount_share * createDividendDto.share_price;
      let amount_share_debited, amount_pay = 0;
      if(createDividendDto.type === 1) {
        amount_share_debited = (createDividendDto.share_debited / 100) * amount_share_credited
        amount_pay = amount_share_credited - amount_share_debited
      }else {
        amount_share_debited = 0
        amount_pay = amount_share_credited
      }
      const dividend = await this.dividendRepository.create({
        title: createDividendDto.title,
        type: createDividendDto.type,
        emitent_id: createDividendDto.emitent_id,
        share_price: createDividendDto.share_price,
        amount_share,
        amount_share_credited,
        amount_share_debited,
        amount_pay,
        month_year: createDividendDto.month_year,
        date_close_reestr: createDividendDto.date_close_reestr
      })
      const createDividendPromises = shareholders.map(async (shareholder) => {
        const share_count = shareholder.quantity;
        const share_credited = shareholder.quantity * createDividendDto.share_price;
        let holder_amount_pay = 0;
        let share_debited = 0;
        if(createDividendDto.type === 1) {
          share_debited = (createDividendDto.share_debited / 100) * share_credited
          holder_amount_pay = share_credited - share_debited
        }else {
          share_debited = 0.00
          holder_amount_pay = share_credited
        }
        return this.dividendTransactionRepository.create({
          dividend_id: dividend.id,
          holder_id: shareholder.holder_id,
          share_count,
          share_credited,
          share_debited,
          amount_pay: holder_amount_pay,
        });
      });
  
      const dividendTrnsaction = await Promise.all(createDividendPromises);
      return {
        dividend,
        dividendTrnsaction
      };
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
        [sequelize.fn('COUNT', sequelize.col('Dividend.id')), 'holder_count'],

      ],
      where: {
        emitent_id: eid
      },
      include: [
        {
          model: HolderType,
          attributes: ['id', 'name']
        }
      ],
      group: [
        'Dividend.emitent_id', 
        'Dividend.date_payment',
        'type.id'
      ],
    });
  }

  async getDividendsByDate(eid: number, date: string) {
    // return await this.dividendRepository.findAll({
    //   where: {
    //     emitent_id: eid,
    //     date_payment: date
    //   },
    //   include: [
    //     {
    //       model: Holder,
    //       attributes: ['id', 'name']
    //     }
    //   ]
    // });
    return 'test'
  }
}
