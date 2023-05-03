import { model, Schema } from "mongoose";
import { Organization } from "../../lib/types";
import Constants from "../../utils/Constants";

const schema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(Constants.organization.types),
      default: Constants.organization.types.INDIVIDUAL,
    },
    name: { type: String, default: null },
    phone_number: { type: String, default: null },
    address: { type: String, default: null },
    website: { type: String, default: null },
    user: { type: Schema.Types.ObjectId, ref: "users" },
    __v: { type: Number, select: false },
  },
  { timestamps: true }
);

const Organization = model<Organization>("organizations", schema);

export default Organization;
