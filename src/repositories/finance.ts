import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import APIQueryBuilder from 'src/utils/api-query-builder';
import { Finance, FinanceDocument } from '../schemas/Finance';

@Injectable()
class FinanceRepository {
  constructor(
    @InjectModel(Finance.name) private financeModel: Model<FinanceDocument>,
  ) {}

  async get(queryParams: any) {
    const builder = new APIQueryBuilder(this.financeModel.find(), queryParams)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await builder.query;

    return {
      docs,
      total: docs.length,
    };
  }

  create(data: Partial<FinanceDocument>) {
    return this.financeModel.create(data);
  }
}

export default FinanceRepository;
