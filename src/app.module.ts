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
      models: [
        Company,
        User, 
        Emitent, 
        EmissionType, 
        Emission, 
        Account, 
        AccountType, 
        Holder, 
        Security, 
        SecurityType,
        SecurityAttitude,
        SecurityStatus,
        Transaction,
        TransactionOperation
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
  ],
})
export class AppModule {}
