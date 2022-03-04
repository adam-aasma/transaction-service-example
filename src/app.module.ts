import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurations, { DatabaseConfig } from './config/configurations';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionModule } from './transaction.module.ts/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurations],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get<DatabaseConfig>('database'),
        entities: [ClientEntity, TransactionEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TransactionModule,
  ],
  providers: [],
})
export class AppModule {}
