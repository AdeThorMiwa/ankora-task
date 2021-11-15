import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { join } from 'path';
import FinanceRepository from '../repositories/finance';
import EmailService from './email';
import { USER_NOTIFY_EMAIL, USER_NOTIFY_EMAIL_FAIL } from '../template';
let csvToJson = require('convert-csv-to-json');

@Processor('csv-processor')
export class Consumer {
  constructor(
    private readonly financeRepository: FinanceRepository,
    private readonly emailService: EmailService,
  ) {}
  @Process('process-csv')
  async process(
    job: Job<{ user: { email: string; _id: string }; file: string }>,
  ) {
    const { user, file } = job.data;
    console.log(user);

    // get file path
    const filePath = join(__dirname, `../uploads/${file}`);
    console.log(filePath);
    try {
      // extract to json
      const json = csvToJson.fieldDelimiter(',').getJsonFromCsv(filePath);
      const insertPromise = json.map(
        async ({
          id,
          price,
          isPaid,
          numSubscribers,
          numReviews,
          numPublishedLectures,
          Total,
          ...rest
        }: any) =>
          await this.financeRepository.create({
            ...rest,
            owner: user._id,
            id: +id,
            price: isNaN(price) ? 0 : +price,
            isPaid: isPaid === 'TRUE' ? true : false,
            numSubscribers: isNaN(numSubscribers) ? 0 : +numSubscribers,
            numReviews: isNaN(numReviews) ? 0 : +numReviews,
            numPublishedLectures: isNaN(numPublishedLectures)
              ? 0
              : +numPublishedLectures,
            Total: isNaN(Total) ? 0 : +Total,
          }),
      );

      // insert into db
      const inserted = await Promise.all(insertPromise);

      // let user know we've completed the job: send user email
      await this.emailService.send(
        [user.email],
        'File Upload Completed!',
        USER_NOTIFY_EMAIL,
        {
          email: user.email,
          link: process.env.WEB_URL,
          count: inserted.length + '',
        },
      );

      // TODO: delete file
    } catch (e) {
      console.log(e);
      await this.emailService.send(
        [user.email],
        'File Upload Failed!',
        USER_NOTIFY_EMAIL_FAIL,
        { email: user.email, link: process.env.WEB_URL, reason: e },
      );
    }
  }
}
