import { EMessage, SMessage } from "../service/message.js";
import { sendCreate, sendError,sendSuccess } from "../service/response.js";
import con from "../config/db.js";
import {v4 as uuid} from "uuid";
export default class PartController {
  static selectAll = async (req, res) => {
    try {
      const mysql = "select * from part";
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
      const pUuid = req.params.pUuid;
      if (!pUuid) {
        return sendError(res, 400, "part is reqiured!");
      }
      const mysql = "Select * from part WHERE pUuid =?";
      con.query(mysql, pUuid, function (err, result) {
        if (err) return sendError(res, 500, EMessage.server, err);
        return sendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
  static insert = async (req, res) => {
    try {
      const { pName, } = req.body;
      if (!pName) {
        return sendError(res, 400, "pName is required!");
      }
      const mysql =
        "insert into part (pUuid,pName,createdAt,updatedAt) values (?,?,?,?)";
        const pUuid = uuid();
        var date = new Date()
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");
      con.query(mysql, [pUuid,pName,date,date], function (err) {
        if (err) return sendError(res, 404, "Error Insert");
        return sendCreate(res, SMessage.insert);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static updatePart = async (req, res) => {
    try {
        const pUuid = req.params.pUuid;
        if(!pUuid){
            return sendError(res,400,"part params is required")
        }
      const { pName } = req.body;
      if (!pName) {
        return sendError(res, 400, "pName is required!");
      }
      var date = new Date()
      .toISOString()
      .replace(/T/, " ") // replace T with a space
      .replace(/\..+/, "");
      const mysql = "update part set pName =?,updatedAt=? where pUuid=?";
       
      con.query(mysql,[pName,date,pUuid], function (err) {
        if (err) return sendError(res, 404, "Error Update");
        return sendCreate(res, SMessage.update);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static deletePart = (req, res) => {
    try {
      const pUuid = req.params.pUuid;
      if (!pUuid) {
        return sendError(res, 400, "part is reqiured!");
      }
      const deletePart = "DELETE From part WHERE pUuid =?";
      con.query(deletePart, pUuid, function (err) {
        if (err) return sendError(res, 500, EMessage.server, err);
        return sendSuccess(res, SMessage.delete);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
}
