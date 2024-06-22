import breakModel from "../../../models/break";

const breakServices = {
  async createBreak(insertObj) {
    return await breakModel.create(insertObj);
  },

  async findBreak(query) {
    return await breakModel.findOne(query);
  },

  async updateBreak(query) {
    return await breakModel.findOneAndUpdate({_id:query._id}, {$set:query}, { new: true });
  },

  updateBreaks: async (query, updateObj) => {
    return await breakModel.findOneAndUpdate(query, updateObj, { new: true });
},

  async breakList(query) {
    return await breakModel.find(query).sort({ createdAt: -1 });
  },

  async breakListData(query) {
    return await breakModel.find(query).sort({ createdAt: -1 });
  }
};

export { breakServices };
