import Mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from "../enums/status";
const options = {
  collection: "employeeId",
  timestamps: true,
};

const employeeIdModel = new Schema(
  {
    chatId: { type: String },
    email: { type: String },
    name: { type: String },
    number: { type: String },
    employeeId: { type: String },
    count: { type: String },
    userType: { type: String, default: userType.ADMIN },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
employeeIdModel.plugin(mongoosePaginate);
employeeIdModel.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("employeeId", employeeIdModel);
