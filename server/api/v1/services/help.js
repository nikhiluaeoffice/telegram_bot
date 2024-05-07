
import helpModel from "../../../models/help";
import status from '../../../enums/status';
import mongoose from "mongoose";



const helpServices = {


  createHelp: async (insertObj) => {
    return await helpModel.create(insertObj);
  },

  findHelp: async (query) => {
    return await helpModel.findOne(query);
  },

  updateHelp: async (query, updateObj) => {
    return await helpModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  updateHelpById: async (query, updateObj) => {
    return await helpModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

  insertManyHelp: async (obj) => {
    return await helpModel.insertMany(obj);
  },

  listHelp: async (query) => {
    return await helpModel.find(query);
  },


  deleteOne: async (query) => {
    return await helpModel.deleteOne(query);
  }


}

module.exports = { helpServices };

