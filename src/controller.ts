import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { UserDto } from './dto';
import FinanceRepository from './repositories/finance';
import { AppService } from './service';
import { editFileName, imageFileFilter } from './utils/app';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly financeRepository: FinanceRepository,
  ) {}

  @Get('/')
  async get(@Query() queryParams: any) {
    const data = await this.financeRepository.get(queryParams);

    return {
      status: 200,
      data,
      message: 'Successful',
    };
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: editFileName,
        destination: join(__dirname, `./uploads/`),
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UserDto,
  ) {
    const data = await this.appService.queueForDBWrite(file, body.email);

    return {
      status: 200,
      data,
      message: "Upload Began. You'll get notified once its done",
    };
  }
}
