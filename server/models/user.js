import Mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from "../enums/status";
const options = {
  collection: "user",
  timestamps: true,
};

const userModel = new Schema(
  {
    chatId: { type: String },
    name: { type: String },
    email: {type: String},
    employeeID: { type: String },
    isLoggedIn: { type: Boolean, default: false },
    isOnBreak: { type: Boolean, default: false },
    userType: { type: String, default: userType.USER },
    status: { type: String, default: status.ACTIVE },
    password: {type: String}
  },
  options
);
userModel.plugin(mongoosePaginate);
userModel.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("user", userModel);

