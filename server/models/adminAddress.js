
import Mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import status from '../enums/status';
import transactionStatus from '../enums/transactionStatus';
const options = {
    collection: "adminAddress",
    timestamps: true,
};

const adminAddressModel = new Schema(
    {
        tokenId: { type: Mongoose.Types.ObjectId, ref: 'tokenAddress' },
        userId: { type: Mongoose.Types.ObjectId, ref: 'user' },
        tokenOwnerAddress: { type: String },
        repoBalance: { type: Number, default: 0.0},
        contractAddress: { type: String },
        status: { type: String, default: status.ACTIVE },
        symbol: { type: String },
        userwalletAddress:{type: String }
    },
    options
);
adminAddressModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("adminAddress", adminAddressModel);




