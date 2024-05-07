import Mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from "../enums/status";
const options = {
  collection: "help",
  timestamps: true,
};

const helpModel = new Schema(
  {
    chatId: { type: String },
    help: { type: String },
    employeeID: { type: String },
    isLoggedIn: { type: Boolean, default: false },
    isOnBreak: { type: Boolean, default: false },
    userType: { type: String, default: userType.USER },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
helpModel.plugin(mongoosePaginate);
helpModel.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("help", helpModel);
