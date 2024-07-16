import Mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from "../enums/status";
const options = {
  collection: "attendance",
  timestamps: true,
};

const attendanceModel = new Schema(
  {
    chatId: { type: String },
    punchIn: { type: String },
    punchOut: { type: String },
    employeeID: {type: String},
    totalHrs: { type: Number, default: 0 },
    // date: { type: String },
    // day: {type: String},
    isHalfDay: {type: Boolean, default: false},
    loggedIn: {type: Boolean, default: false},
    userType: { type: String, default: userType.USER },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
attendanceModel.plugin(mongoosePaginate);
attendanceModel.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("attendance", attendanceModel);
