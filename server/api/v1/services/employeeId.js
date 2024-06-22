import employeeIdModel from "../../../models/employeeId";

const employeeIdServices = {
  createEmployeeId: async (insertObj) => {
    return await employeeIdModel.create(insertObj);
  },

  findEmployeeId: async (query) => {
    return await employeeIdModel.findOne(query);
  },

  updateEmployeeIdById: async (employeeId, updateObj) => {
    return await employeeIdModel.findByIdAndUpdate(employeeId, updateObj, { new: true });
  },

  employeeIdList: async (query) => {
    return await employeeIdModel.find(query).select('address contractAddress').sort({ createdAt: -1 });
  },

  employeeIdListData: async (query) => {
    return await employeeIdModel.find(query).sort({ createdAt: -1 });
  }
};

export { employeeIdServices };
