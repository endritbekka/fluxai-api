import { model, Schema } from "mongoose";
import { EmailTemplate as EmailTemplateI } from "../../lib/types";

const schema: Schema = new Schema(
  {
    name: { type: String, default: null },
    subject: { type: String },
    content: { type: String },
    instructions: { type: String, default: null },
    organization: { type: Schema.Types.ObjectId, ref: "organizations" },
    __v: { type: Number, select: false },
  },
  { timestamps: true }
);

const EmailTemplate = model<EmailTemplateI>("email-templates", schema);

export default EmailTemplate;
