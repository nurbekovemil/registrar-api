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
import { ClientsModule } from './clients/clients.module';
import { Account } from "./accounts/entities/account.entity";
import { AccountType } from "./accounts/entities/account-types.entity";

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
      models: [User, Emitent, Emission, Account, AccountType],
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    EmitentsModule,
    EmissionsModule,
    AccountsModule,
    ClientsModule,
  ],
})
export class AppModule {}
