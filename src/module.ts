import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './controller';
import { AppService } from './service';
import { User, UserSchema } from './schemas/user';
import { Finance, FinanceSchema } from './schemas/finance';
import UserRepository from './repositories/user';
import FinanceRepository from './repositories/finance';
import { BullModule } from '@nestjs/bull';
import { MulterModule } from '@nestjs/platform-express';
import { Consumer } from './services/consumer';
import EmailService from './services/email';
import { AwsSdkModule } from 'nest-aws-sdk';
import { SES } from 'aws-sdk';

console.log(process.env.DATABASE_URI);

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Finance.name, schema: FinanceSchema },
    ]),
    BullModule.registerQueue({
      name: 'csv-processor',
    }),
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: process.env.AWS_DEFAULT_REGION,
        correctClockSkew: true,
      },
      services: [SES],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserRepository,
    FinanceRepository,
    Consumer,
    EmailService,
  ],
})
export default class AppModule {}
