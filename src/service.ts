import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import UserRepository from './repositories/user';

@Injectable()
export class AppService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectQueue('csv-processor') private csvProcessorQueue: Queue,
  ) {}

  async queueForDBWrite(file: Express.Multer.File, email: string) {
    if (!file) throw new BadRequestException('file must be present in request');
    // create user with email
    // TODO: if user already in db, dont insert
    const user = await this.userRepository.create(email);

    // send file to queue
    await this.csvProcessorQueue.add('process-csv', {
      user,
      file: file.filename,
    });

    return undefined;
  }
}
