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
      let shareholders;
      if(!createDividendDto.district_id) {
        shareholders = await this.securityService.getEmitentHoldersByHolderType(createDividendDto.emitent_id, createDividendDto.type);
      } else {
        shareholders = await this.securityService.getEmitentHoldersByHolderDictrict(createDividendDto.emitent_id, createDividendDto.type, createDividendDto.district_id);
      }
      if (!shareholders.length) {
        throw new HttpException('Акционеры не найдены', HttpStatus.NOT_FOUND);
      }
      const amount_share = shareholders.reduce((acc, item) => acc + item.quantity, 0);
      const amount_share_credited = amount_share * createDividendDto.share_price;
      let amount_share_debited, amount_pay = 0;
      if(createDividendDto.type === 1) {
        amount_share_debited = (createDividendDto.percent / 100) * amount_share_credited
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
        percent: createDividendDto.percent,
        amount_share,
        amount_share_credited,
        amount_share_debited,
        amount_pay,
        month_year: createDividendDto.month_year,
        date_close_reestr: createDividendDto.date_close_reestr,
        district_id: createDividendDto.district_id
      })
      const createDividendPromises = shareholders.map(async (shareholder) => {
        const share_count = shareholder.quantity;
        const share_credited = shareholder.quantity * createDividendDto.share_price;
        let holder_amount_pay = 0;
        let share_debited = 0;
        if(createDividendDto.type === 1) {
          share_debited = (createDividendDto.percent / 100) * share_credited
          holder_amount_pay = share_credited - share_debited
        }else {
          share_debited = 0.00
          holder_amount_pay = share_credited
        }
        return this.dividendTransactionRepository.create({
          dividend_id: dividend.id,
          holder_id: shareholder.holder_id,
          share_count,
          percent: createDividendDto.percent,
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

  async getAllDividendList(eid: number) {
    const dividends = await this.dividendRepository.findAll({
      where: {
        emitent_id: eid,
      },
      include: [
        {
          model: HolderType
        },
        {
          model: Emitent,
          attributes: ['id', 'full_name']
        }
      ]
    })
    return dividends
  }

  async getDividendDetails(did: number) {
    const dividend_transactions = await this.dividendRepository.findOne({
      where: {
        id: did
      },
      include: [
        {
          model: Emitent,
          attributes: ['id', 'full_name']
        },
        {
          model: HolderType
        },
      ]
    })
    return dividend_transactions
  }

  async getDividendTransactions(did: number) {
    const dividend_transactions = await this.dividendRepository.findOne({
      where: {
        id: did
      },
      attributes: {
        exclude: ['emitent_id']
      },
      include: [
        {
          model: Emitent,
          attributes: ['id', 'full_name']
        },
        {
          model: HolderType
        },
        {
          model: DividendTransaction,
          include: [
            {
              model: Holder,
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    })
    return dividend_transactions
  }

  async deleteEmitentDividends(eid: number, transaction: any) {
    await this.dividendRepository.destroy({
      where: {
        emitent_id:eid
      },
      transaction
    })
  }
}
