import config from "config";
import jwt from "jsonwebtoken";
import userModel from "../models/user";
import apiError from './apiError';
import responseMessage from '../../assets/responseMessage';

module.exports = {

  verifyToken(req, res, next) {
    try {
      const authorizationHeader = req.headers['authorization'];
      console.log(">>>>>>>>", authorizationHeader);
      if(!authorizationHeader){
        throw apiError.unauthorized(responseMessage.TOKEN_EXPIRED)
      }
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw apiError.unauthorized(responseMessage.NO_TOKEN);
      }
      
      const token = authorizationHeader.split(' ')[1];

      jwt.verify(token, config.get('jwtsecret'), (err, decoded) => {
        if (err) {
          throw apiError.unauthorized();
        }

        userModel.findOne({ _id: decoded.userId }, (error, user) => {
          if (error) {
            return next(error);
          } else if (!user) {
            throw apiError.notFound(responseMessage.USER_NOT_FOUND);
          } else if (user.status === "BLOCK") {
            throw apiError.forbidden(responseMessage.BLOCK_BY_ADMIN);
          } else if (user.status === "DELETE") {
            throw apiError.unauthorized(responseMessage.DELETE_BY_ADMIN);
          }

          req.userId = decoded.userId;
          req.userDetails = decoded;
          next();
        });
      });
    } catch (error) {
      return next(error);
    }
  },


  verifyTokenBySocket: (token) => {
    return new Promise((resolve, reject) => {
      try {
        if (token) {
          jwt.verify(token, config.get('jwtsecret'), (err, result) => {
            if (err) {
              reject(apiError.unauthorized());
            }
            else {
              userModel.findOne({ _id: result.id }, (error, result2) => {
                if (error)
                  reject(apiError.internal(responseMessage.INTERNAL_ERROR));
                else if (!result2) {
                  reject(apiError.notFound(responseMessage.USER_NOT_FOUND));
                }
                else {
                  if (result2.status == "BLOCK") {
                    reject(apiError.forbidden(responseMessage.BLOCK_BY_ADMIN));
                  }
                  else if (result2.status == "DELETE") {
                    reject(apiError.unauthorized(responseMessage.DELETE_BY_ADMIN));
                  }
                  else {
                    resolve(result.id);
                  }
                }
              })
            }
          })
        } else {
          reject(apiError.badRequest(responseMessage.NO_TOKEN));
        }
      }
      catch (e) {
        reject(e);
      }
    })
  }

}



