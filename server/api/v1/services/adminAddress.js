
import adminAddressModel from "../../../models/adminAddress";

const adminAddressServices = {


    createAdminAddress: async (insertObj) => {
        return await adminAddressModel.create(insertObj);
    },

    findAdminAddress: async (query) => {
        return await adminAddressModel.findOne(query);
    },

    updateAdminAddress: async (query, updateObj) => {
        return await adminAddressModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    adminAddressList: async (query) => {
        return await adminAddressModel.find(query).select('address contractAddress').sort({ createdAt: -1 });
    },
    adminAddressListData: async (query) => {
        return await adminAddressModel.find(query).sort({ createdAt: -1 });
    }

}

module.exports = { adminAddressServices };

