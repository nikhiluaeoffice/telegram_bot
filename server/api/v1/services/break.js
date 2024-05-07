
import breakModel from "../../../models/break";

const breakServices = {


    createBreak: async (insertObj) => {
        return await breakModel.create(insertObj);
    },

    findBreak: async (query) => {
        return await breakModel.findOne(query);
    },

    updateBreak: async (query, updateObj) => {
        return await breakModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    breakList: async (query) => {
        return await breakModel.find(query).select('address contractAddress').sort({ createdAt: -1 });
    },
    breakListData: async (query) => {
        return await breakModel.find(query).sort({ createdAt: -1 });
    }

}

module.exports = { breakServices };

