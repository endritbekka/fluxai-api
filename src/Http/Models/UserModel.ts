import { model, Schema } from "mongoose";
import { User as UserI } from "../../lib/types";
import Constants from "../../utils/Constants";

const schema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Constants.user.roles),
      default: Constants.user.roles.USER,
    },
    verified: { type: Boolean, default: false },
    two_factor_auth_enabled: { type: Boolean, default: true },
    __v: { type: Number, select: false },
  },
  { timestamps: true }
);

const User = model<UserI>("users", schema);

export default User;
