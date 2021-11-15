import { Injectable } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';

@Injectable()
class EmailService {
  constructor(@InjectAwsService(SES) private readonly ses: SES) {}

  async send(
    emails: string[],
    subject: string,
    body: string,
    data: Record<string, string>,
  ) {
    const params = {
      Source: process.env.MAIL_FROM,
      Destination: {
        ToAddresses: emails,
      },
      ReplyToAddresses: [process.env.MAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: this.replaceTemplateValue(body, data),
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
    };

    const response = await this.ses.sendEmail(params as any).promise();
    console.log(response);
  }

  private replaceTemplateValue(
    template: string,
    data: Record<string, string>,
  ): string {
    let temp = template;
    for (const key in data) {
      temp = temp.replace(`{{${key}}}`, data[key]);
    }
    return temp;
  }
}

export default EmailService;
