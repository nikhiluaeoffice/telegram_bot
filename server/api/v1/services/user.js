
import userModel from "../../../models/user";
import status from '../../../enums/status';
import mongoose from "mongoose";



const userServices = {


  createUser: async (insertObj) => {
    return await userModel.create(insertObj);
  },

  findUser: async (query) => {
    return await userModel.findOne(query);
  },

  updateUser: async (query, updateObj) => {
    return await userModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  updateUserById: async (query, updateObj) => {
    return await userModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

  insertManyUser: async (obj) => {
    return await userModel.insertMany(obj);
  },

  listUser: async (query) => {
    return await userModel.find(query);
  },

  userList: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE } };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { walletAddress: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } }
      ]
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ]
    }
    let options = {
      page: page || 1,
      limit: limit || 10,
      sort: { createdAt: -1 },
      select: '-ethAccount.privateKey'
    };
    return await userModel.paginate(query, options);
  },

  deleteOne: async (query) => {
    return await userModel.deleteOne(query);
  }


}

module.exports = { userServices };
const createAdmin = async () => {
  try {
    // Check if an admin user already exists
    const existingAdmin = await userModel.find({ userType: "ADMIN" });

    if (existingAdmin.length == 0) {
      // Create a new admin user if not found
      const adminUser = {
        name: "Nikhil Chauhan",
        email: "nikhiltest@mailinator.com",
        number: 7088870224, // Set a default number
        userType: "ADMIN",
        status: status.ACTIVE // Ensure status is consistent with enum
      };

      const createdAdmin = await userModel.create(adminUser);
      console.log("Admin user created:", createdAdmin);
    } else {
      console.log("Admin user already exists:", existingAdmin);
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

// Call the function to create an admin user
createAdmin();