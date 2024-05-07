import Mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from "../enums/status";
const options = {
  collection: "break",
  timestamps: true,
};

const breakModel = new Schema(
  {
    chatId: { type: String },
    breakIn: { type: String },
    breakOut: { type: String },
    totalBreakTime: { type: String },
    employeeID: { type: String },
    onBreak: { type: Boolean, default: false },
    userType: { type: String, default: userType.USER },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
breakModel.plugin(mongoosePaginate);
breakModel.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("break", helpModel);
