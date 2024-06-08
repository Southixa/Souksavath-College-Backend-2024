import { EMessage, SMessage } from "../service/message.js";
import { sendCreate, sendError,sendSuccess } from "../service/response.js";
import con from "../config/db.js";
import {v4 as uuid} from "uuid";
export default class MajorController {
  static selectAll = async (req, res) => {
    try {
      const mysql = "select * from major";
      con.query(mysql, function (err, result) {
        if (err) return sendError(res, 500, EMessage.server, err);
        return sendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static selectOne = async (req, res) => {
    try {
      const mUuid = req.params.mUuid;
      if (!mUuid) {
        return sendError(res, 400, "major is reqiured!");
      }
      const mysql = "Select * from major WHERE mUuid =?";
      con.query(mysql, mUuid, function (err, result) {
        if (err) return sendError(res, 500, EMessage.server, err);
        return sendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
  static insert = async (req, res) => {
    try {
      const { mName } = req.body;
      if (!mName) {
        return sendError(res, 400, "mName is required!");
      }
      const mysql =
        "insert into major (mUuid,mName,createdAt,updatedAt) values (?,?,?,?)";
        const mUuid = uuid();
        var date = new Date()
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");
      con.query(mysql, [mUuid,mName,date,date], function (err) {
        if (err) return sendError(res, 404, "Error Insert");
        return sendCreate(res, SMessage.insert);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static updateMajor = async (req, res) => {
    try {
        const mUuid = req.params.mUuid;
        if(!mUuid){
            return sendError(res,400,"major params is required")
        }
      const { mName } = req.body;
      if (!mName) {
        return sendError(res, 400, "mName is required!");
      }
      var date = new Date()
      .toISOString()
      .replace(/T/, " ") // replace T with a space
      .replace(/\..+/, "");
      const mysql = "update major set mName =?,updatedAt=? where mUuid=?";
       
      con.query(mysql,[mName,date,mUuid], function (err) {
        if (err) return sendError(res, 404, "Error Update");
        return sendCreate(res, SMessage.update);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static deleteMajor = (req, res) => {
    try {
      const mUuid = req.params.mUuid;
      if (!mUuid) {
        return sendError(res, 400, "major is reqiured!");
      }
      const deleteMajor = "DELETE From major WHERE mUuid =?";
      con.query(deleteMajor, mUuid, function (err) {
        if (err) return sendError(res, 500, EMessage.server, err);
        return sendSuccess(res, SMessage.delete);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
}
