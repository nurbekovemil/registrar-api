import { HolderStatus } from 'src/holders/entities/holder-status.entity';
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
import { HolderDistrict } from 'src/holders/entities/holder-district.entity';
import { SecurityType } from 'src/securities/entities/security-type.entity';
import { HolderType } from 'src/holders/entities/holder-type.entity';
import { TransactionOperation } from 'src/transactions/entities/transaction-operation.entity';
import { EmissionType } from 'src/emissions/entities/emission-type.entity';
import { SecurityAttitude } from 'src/securities/entities/security-attitude.entity';
import { SecurityStatus } from 'src/securities/entities/security-status.entity';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Emitent) private emitentRepository: typeof Emitent,
    @InjectModel(Emission) private emissionRepository: typeof Emission,
    @InjectModel(EmissionType) private emissionTypeRepository: typeof EmissionType,
    @InjectModel(Holder) private holderRepository: typeof Holder,
    @InjectModel(HolderDistrict) private holderDistrictRepository: typeof HolderDistrict,
    @InjectModel(HolderType) private holderTypeRepository: typeof HolderType,
    @InjectModel(Transaction) private transactionRepository: typeof Transaction,
    @InjectModel(TransactionOperation) private transactionOperationRepository: typeof TransactionOperation,
    @InjectModel(HolderStatus) private holderStatusRepository: typeof HolderStatus,
    @InjectModel(Security) private securityRepository: typeof Security,
    @InjectModel(SecurityType) private securityTypeRepository: typeof SecurityType,
    @InjectModel(SecurityAttitude) private securityAttitudeRepository: typeof SecurityAttitude,
    @InjectModel(SecurityStatus) private securityStatusRepository: typeof SecurityStatus,
    @InjectModel(Document) private documentRepository: typeof Document,
    @InjectModel(User) private userRepository: typeof User,
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

async insertAllData(data) {
  try {
    // один объект эмиссии

    for (const emitentData of data.emitents) { // массив эмитентов
      const emissionData = emitentData.emissions[0]; 
      const emitent = await this.emitentRepository.create({
        full_name: emitentData.full_name,
      });

      const emission = await this.emissionRepository.create({
        emitent_id: emitent.id,
        type_id: emissionData.type_id,
        reg_number: emissionData.reg_number,
        start_count: emissionData.start_count,
        count: emissionData.count,
      });
      emission.nominal = emissionData.nominal;
       emission.release_date = new Date().toDateString();
      await emission.save();

      for (const holderData of emitentData.holders) {
        const holder = await this.holderRepository.create({
          name: holderData.name,
          actual_address: holderData.actual_address,
          holder_type: 1,
          district_id: holderData.district_id,
        });
        holder.phone_number = holderData.phone_number;
        holder.passport_type = holderData.passport_type;
        holder.passport_number = holderData.passport_number;
        holder.passport_agency = holderData.passport_agency;
        holder.holder_status = holderData.holder_status;
        await holder.save();
        
        const security = await this.securityRepository.create({
          emission_id: emission.id,
          emitent_id: emitent.id,
          attitude_id: 1,
          status_id: 1,
          type_id: 1,
          holder_id: holder.id,
          quantity: holderData.ordinary_shares,
        });

        const transaction = await this.transactionRepository.create({
          is_exchange: false,
          operation_id: 29,
          emission_id: emission.id,
          holder_to_id: holder.id,
          is_family: false,
          quantity: holderData.ordinary_shares,
          amount: 0,
          contract_date: new Date().toDateString()
        });
        transaction.emitent_id = emitent.id;
        transaction.security_id = security.id;
        await transaction.save();

        const document = await this.documentRepository.create({
          title: 'Перв ввод',
          emitent_id: emitent.id,
        });
        document.provider_name = holderData.name;
        document.signer_name = 'Гульнара';
        await document.save();
      }
    }

    return { message: '✅ Все данные успешно вставлены' };
  } catch (error) {
    console.error('❌ Ошибка при вставке данных:', error);
    // throw new common_1.HttpException('Ошибка при вставке данных', common_1.HttpStatus.BAD_REQUEST);
  }
}


async core(data) {
  try {
    const {     
      holder_districts,
      holder_types,
      transaction_operations,
      security_types,
      holder_status,
      security_attitudes
    } = data;

    for (const district of holder_districts) {
      const holder_district = await this.holderDistrictRepository.create({ 
        // id: district.id, 
        name: district.name 
      });
      holder_district.region = district.region;
      await holder_district.save();
    }

    for (const type of holder_types) {
      await this.holderTypeRepository.create({ name: type.name });
    }

    for (const operation of transaction_operations) {
      await this.transactionOperationRepository.create({ name: operation.name });
    }

    for (const type of security_types) {
      await this.emissionTypeRepository.create({ name: type.name });
      await this.securityTypeRepository.create({ name: type.name });
    }

    for (const attitude of security_attitudes) {
      await this.holderStatusRepository.create({ name: attitude.name });
      await this.securityAttitudeRepository.create({ name: attitude.name });
    }

    const statuses = [
      { id: 1, name: "Активные" },
      { id: 2, name: "Заблокированные" },
      { id: 3, name: "Погашенные" },
      { id: 4, name: "Приостановленные" },
      { id: 5, name: "Испорченные" },
      { id: 6, name: "Проданные" },
      { id: 7, name: "Переданные в дар" },
      { id: 8, name: "Утерянные" }
    ];

    for (const status of statuses) {
      await this.securityStatusRepository.create({ name: status.name });
    }

    const users = [
      {
        login: 'admin',
        password: '$2a$05$Hxlbyq3qorMeHSDiUZEy7uVqhsKj/APnvx79drOlLK9S7v.TGNdH6',
        first_name: 'Админ',
        last_name: 'Админов'
      }
    ]

    for (const user of users) {
      await this.userRepository.create({
        login: user.login,
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name,});
    }

    return { message: '✅ Все данные успешно вставлены' };
  } catch (error) {
    console.error('❌ Ошибка при вставке данных:', error);
    // throw new HttpException('Ошибка при вставке данных', HttpStatus.BAD_REQUEST);
  }
}


}
