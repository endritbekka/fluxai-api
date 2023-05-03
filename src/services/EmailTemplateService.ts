import EmailTemplateModel from "../Http/Models/EmailTemplateModel";
import { CreateEmailTemplate } from "../lib/types";

class EmailTemplateService {
  public async create(data: CreateEmailTemplate) {
    return await EmailTemplateModel.create(data);
  }

  public async find(query = {}) {
    return await EmailTemplateModel.find(query).lean().exec();
  }

  public async findOneAndDelete(query = {}) {
    return await EmailTemplateModel.findOneAndDelete(query).lean().exec();
  }
}

export default EmailTemplateService;
