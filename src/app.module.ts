import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/entities/users.entity";
import { UsersModule } from "./users/users.module";

import { AuthModule } from "./auth/auth.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { RegistryManagementModule } from "./registry-management/registry-management.module";
import { OperationsModule } from "./operations/operations.module";
import { ReportsModule } from "./reports/reports.module";
import { DirectoriesModule } from "./directories/directories.module";
import { AdministrationsModule } from "./administrations/administrations.module";
import { DirectoriesModule } from "./directories/directories.module";
import * as path from "path";

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
      models: [User],
      autoLoadModels: true,
    }),
    UsersModule,

    AuthModule,

    RegistryManagementModule,

    OperationsModule,

    ReportsModule,

    DirectoriesModule,

    AdministrationsModule,
  ],
})
export class AppModule {}
