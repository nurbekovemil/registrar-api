import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { Emission } from 'src/emissions/entities/emission.entity';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import { Security } from 'src/securities/entities/security.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Emitent) private emitentRepository: typeof Emitent,
    @InjectModel(Emission) private emissionRepository: typeof Emission,
    @InjectModel(Holder) private holderRepository: typeof Holder,
    @InjectModel(Security) private securityRepository: typeof Security,
  ){}

  async processAllExcelFiles() {
    try {
      const folderPath = path.join(__dirname, '..', '..', 'excel_data');
      const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.xls') || f.endsWith('.xlsx'));

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        let allRows: any = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        const companyName = allRows[1].filter(Boolean).join(' ').trim();
        allRows.splice(1, 8); // удаляем строки 2–9

        const headers = [
          'number', 'account', 'rn', 'full_name', 'quantity', 'price',
          'preferred_shares', 'preferred_shares_price', 'percentage_of_quantity',
          'passport', 'address'
        ];

        const rows = allRows.slice(1);

        const parsedData = rows.map(row => {
          const obj: any = {};
          headers.forEach((key, i) => {
            obj[key] = row[i] ?? null;
          });
          obj.company = companyName;
          return obj;
        });
        const totalQuantity = parsedData.reduce((sum, row) => {
          return sum + (Number(row.quantity) || 0);
        }, 0);

        const isCompanyExists = await this.emitentRepository.findOne({ where: { full_name: companyName } });
        if (isCompanyExists) {
          throw new HttpException(`👎 Импорт из файла ${file} прекращён. Эмитент ${companyName} уже существует в базе данных`, HttpStatus.BAD_REQUEST)
        }

        const emitent = await this.emitentRepository.create({ full_name: companyName });
        const emission = await this.emissionRepository.create({ 
          emitent_id: emitent.id,
          type_id: 1,
          reg_number: parsedData[0].number,
          start_count: totalQuantity,
          count: totalQuantity,
        });
        parsedData.forEach(async (row) => {
          let holder = await this.holderRepository.create({ 
            name: row.full_name, 
            actual_address: row.address,
            holder_type: 1,
            district_id: 1
          });
          await this.securityRepository.create({ 
            emission_id: emission.id, 
            emitent_id: emitent.id,
            attitude_id: 1,
            status_id: 1,
            type_id: 1,
            holder_id: holder.id, 
            quantity: row.quantity
          });
        })
        // await this.holderModel.bulkCreate(parsedData, {
        //   validate: true,
        //   individualHooks: true,
        // });

        console.log(`✅ Импорт из файла ${file} завершён (${parsedData.length} записей)`);
      }

      return { message: 'Все Excel-файлы обработаны и импортированы в базу' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
