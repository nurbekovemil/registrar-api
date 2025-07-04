import * as path from "path";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/entities/users.entity";
import { UsersModule } from "./users/users.module";

import { AuthModule } from "./auth/auth.module";
import { ServeStaticModule } from "@nestjs/serve-static";

import { EmitentsModule } from './emitents/emitents.module';
import { Emitent } from "./emitents/entities/emitent.entity";
import { EmissionsModule } from './emissions/emissions.module';
import { Emission } from "./emissions/entities/emission.entity";
import { AccountsModule } from './accounts/accounts.module';
import { Account } from "./accounts/entities/account.entity";
import { AccountType } from "./accounts/entities/account-type.entity";
import { HoldersModule } from './holders/holders.module';
import { SecuritiesModule } from './securities/securities.module';
import { EmissionType } from "./emissions/entities/emission-type.entity";
import { Holder } from "./holders/entities/holder.entity";
import { Security } from "./securities/entities/security.entity";
import { SecurityType } from "./securities/entities/security-type.entity";
import { SecurityAttitude } from "./securities/entities/security-attitude.entity";
import { SecurityStatus } from "./securities/entities/security-status.entity";
import { TransactionsModule } from './transactions/transactions.module';
import { PrintsModule } from './prints/prints.module';
import { CompaniesModule } from './companies/companies.module';
import { Company } from "./companies/entities/company.entity";
import { Transaction } from "./transactions/entities/transaction.entity";
import { TransactionOperation } from "./transactions/entities/transaction-operation.entity";
import { SecurityBlock } from "./securities/entities/security-block.entity";
import { DividendsModule } from './dividends/dividends.module';
import { Dividend } from "./dividends/entities/dividend.entity";
import { DividendTransaction } from "./dividends/entities/dividend-transaction.entity";
import { HolderType } from "./holders/entities/holder-type.entity";
import { HolderDistrict } from "./holders/entities/holder-district.entity";
import { AnalysisModule } from './analysis/analysis.module';
import { DocumentsModule } from './documents/documents.module';
import { Document } from "./documents/entities/document.entity";
import { JournalsModule } from './journals/journals.module';
import { Journal } from "./journals/entities/journal.entity";
import { SecurityPledge } from "./securities/entities/security-pledge.entity";
import { HolderStatus } from "./holders/entities/holder-status.entity";
import { SeederModule } from './seeder/seeder.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, "static"),
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      sync: {
        alter: process.env.NODE_ENV === 'development',
      },
      models: [
        Company,
        User, 
        Emitent, 
        EmissionType, 
        Emission, 
        Account, 
        AccountType,
        Document,
        HolderType,
        HolderStatus,
        HolderDistrict,
        Holder, 
        Security, 
        SecurityType,
        SecurityAttitude,
        SecurityStatus,
        SecurityBlock,
        SecurityPledge,
        Transaction,
        TransactionOperation,
        Dividend,
        DividendTransaction,
        Journal
      ],
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    EmitentsModule,
    EmissionsModule,
    AccountsModule,
    HoldersModule,
    SecuritiesModule,
    TransactionsModule,
    PrintsModule,
    CompaniesModule,
    DividendsModule,
    AnalysisModule,
    DocumentsModule,
    JournalsModule,
    SeederModule,
  ],
})
export class AppModule {}
