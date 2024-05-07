
import attendanceModel from "../../../models/attendance";

const attendanceServices = {


    createAttendance: async (insertObj) => {
        return await attendanceModel.create(insertObj);
    },

    findAttendance: async (query) => {
        return await attendanceModel.findOne(query);
    },

    updateAttendance: async (query, updateObj) => {
        return await attendanceModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    attendanceList: async (query) => {
        return await attendanceModel.find(query).select('address contractAddress').sort({ createdAt: -1 });
    },
    attendanceListData: async (query) => {
        return await attendanceModel.find(query).sort({ createdAt: -1 });
    }

}

module.exports = { attendanceServices };

