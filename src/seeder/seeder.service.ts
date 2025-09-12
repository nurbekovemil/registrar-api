import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { Emission } from 'src/emissions/entities/emission.entity';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import { Security } from 'src/securities/entities/security.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Document } from 'src/documents/entities/document.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Emitent) private emitentRepository: typeof Emitent,
    @InjectModel(Emission) private emissionRepository: typeof Emission,
    @InjectModel(Holder) private holderRepository: typeof Holder,
    @InjectModel(Transaction) private transactionRepository: typeof Transaction,
    @InjectModel(Security) private securityRepository: typeof Security,
    @InjectModel(Document) private documentRepository: typeof Document
  ){}

  async processAllExcelFiles() {
    try {
      const folderPath = path.join(__dirname, '..', '..', 'excel_data');
      const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.xls') || f.endsWith('.xlsx'));
      let emission_count = 1;
      this.testReadExcel();
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        let allRows: any = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        let companyName = allRows[1].filter(Boolean).join(' ').trim();
        allRows.splice(1, 8); // удаляем строки 2–9
        allRows = allRows.slice(0, -1);

        const headers = [
          'number', 'account', 'rn', 'full_name', 'quantity', 'price',
          'preferred_shares', 'preferred_shares_price', 'percentage_of_quantity',
          'passport', 'address'
        ];

        const rows = allRows.slice(1);
        // console.log('rows ------- ', rows);
        // const parsedData = rows.map(row => {
        //   const obj: any = {};
        //   headers.forEach((key, i) => {
        //     obj[key] = row[i] ?? null;
        //   });
        //   obj.company = companyName;
        //   return obj;
        // });
        // фильтруем пустые строки
        const rowsFiltered = rows.filter(row => {
          const fullName = row[3]; // колонка full_name
          const quantity = Number(row[4]) || 0; // колонка quantity
          return fullName && quantity > 0; // оставляем только те строки, где есть ФИО и количество
        });

        // теперь маппим уже отфильтрованные строки
        const parsedData = rowsFiltered.map(row => {
          const obj: any = {};
          headers.forEach((key, i) => {
            let value = row[i] ?? null;
            if (typeof value === 'string' && value.trim() === '') value = null;
            if (['quantity', 'price', 'preferred_shares', 'preferred_shares_price'].includes(key)) {
              value = value !== null ? Number(value) || 0 : 0;
            }
            obj[key] = value;
          });
          obj.company = companyName;
          return obj;
        });
        let totalQuantity = parsedData.reduce((sum, row) => {
          return sum + (Number(row.quantity) || 0);
        }, 0);

        let nominalPrice = parsedData.reduce((acc, row) => {
          if (row.quantity > 0 && row.price > 0) {
            return row.price / row.quantity;
          }
          return acc;
        }, 0);

        let isCompanyExists = await this.emitentRepository.findOne({ where: { full_name: companyName } });
        if (isCompanyExists) {
          throw new HttpException(`👎 Импорт из файла ${file} прекращён. Эмитент ${companyName} уже существует в базе данных`, HttpStatus.BAD_REQUEST)
        }

        let emitent = await this.emitentRepository.create({ full_name: companyName });
        let emission = await this.emissionRepository.create({ 
          emitent_id: emitent.id,
          type_id: 1,
          reg_number: `KG000000000${emission_count}`,
          start_count: totalQuantity,
          count: totalQuantity,
          
        });
        emission.nominal = nominalPrice;
        emission.release_date = new Date().toDateString();
        emission.save();

        await Promise.all(parsedData.map(async (row) => {
          let holder = await this.holderRepository.create({ 
            name: row.full_name, 
            actual_address: row.address,
            holder_type: 1,
            district_id: 1
          });

          let security = await this.securityRepository.create({ 
            emission_id: emission.id, 
            emitent_id: emitent.id,
            attitude_id: 1,
            status_id: 1,
            type_id: 1,
            holder_id: holder.id, 
            quantity: row.quantity
          });

          let transaction = await this.transactionRepository.create({
            is_exchange: false,
            operation_id: 1,
            emission_id: emission.id,
            holder_to_id: holder.id,
            is_family: false,
            quantity: row.quantity,
            amount: 0,
            contract_date: new Date().toDateString()
          });

          let document = await this.documentRepository.create({
            title: 'Перв ввод',
            emitent_id: emitent.id
          })
          document.provider_name = row.full_name;
          document.signer_name = 'Гульнара';
          await document.save();

          transaction.emitent_id = emitent.id;
          transaction.security_id = security.id;
          await transaction.save();
        }));
        emission_count++;
      }

      return { message: 'Все Excel-файлы обработаны и импортированы в базу' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async testReadExcel() {
  try {
    const folderPath = path.join(__dirname, '..', '..', 'excel_data');
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.xls') || f.endsWith('.xlsx'));

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      let allRows: any = xlsx.utils.sheet_to_json(sheet, { header: 1 });

      // Считаем имя компании
      let companyName = allRows[1].filter(Boolean).join(' ').trim();

      // Удаляем строки 2–9
      allRows.splice(1, 8);

      // Заголовки
      const headers = [
        'number', 'account', 'rn', 'full_name', 'quantity', 'price',
        'preferred_shares', 'preferred_shares_price', 'percentage_of_quantity',
        'passport', 'address'
      ];

      const rows = allRows.slice(1);

      // Формируем объекты
      const parsedData = rows.map(row => {
        const obj: any = {};
        headers.forEach((key, i) => {
          let value = row[i] ?? null;
          // Если число
          if (['quantity', 'price', 'preferred_shares', 'preferred_shares_price'].includes(key)) {
            value = value !== null ? Number(value) || 0 : 0;
          }
          obj[key] = value;
        });
        obj.company = companyName;
        return obj;
      });

      console.log(`\nФайл: ${file}`);
      console.log('parsedData:', parsedData);

      // Дополнительно можно записать в JSON файл для проверки
      fs.writeFileSync(
        path.join(folderPath, file + '.json'),
        JSON.stringify(parsedData, null, 2),
        'utf-8'
      );
    }
  } catch (error) {
    console.error('Ошибка при чтении Excel:', error);
  }
}
}
