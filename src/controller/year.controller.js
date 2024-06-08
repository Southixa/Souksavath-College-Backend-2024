import { EMessage, SMessage } from "../service/message.js";
import { sendCreate, sendError,sendSuccess } from "../service/response.js";
import con from "../config/db.js";
import { v4 as uuid } from "uuid";
import { ValidateData } from "../service/vaildate.js";
export default class YearController {
  static selectAll = async (req, res) => {
    try {
      const mysql = "select * from year";
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
      const yUuid = req.params.yUuid;
      if (!yUuid) {
        return sendError(res, 400, "year is reqiured!");
      }
      const mysql = "Select * from year WHERE yUuid =?";
      con.query(mysql, yUuid, function (err, result) {
        if (err) return sendError(res, 500, EMessage.server, err);
        return sendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
  static insert = async (req, res) => {
    try {
      const { yearNumber,schoolyear} = req.body;
      const validate = await ValidateData({ yearNumber,schoolyear});
      if (validate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      const mysql =
        "insert into year (yUuid,yearNumber,schoolyear,createdAt,updatedAt) values (?,?,?,?,?)";
      const pUuid = uuid();
      var date = new Date()
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");
      con.query(mysql, [ pUuid,yearNumber,schoolyear,date, date], function (err) {
        if (err) return sendError(res, 404, "Error Insert",err);
        return sendCreate(res, SMessage.insert);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static updateYear = async (req, res) => {
    try {
      const yUuid = req.params.yUuid;
      if (!yUuid) {
        return sendError(res, 400, "year params is required");
      }
      const { yearNumber,schoolyear  } = req.body;
      const validate = await ValidateData({ yearNumber,schoolyear  });
      if (validate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      var date = new Date()
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");
      const mysql = "update year set yearNumber =?, schoolyear=?, updatedAt=? where yUuid=?";

      con.query(mysql, [yearNumber,schoolyear, date, yUuid], function (err, result) {
        if (err) return sendError(res, 404, "Error Update",err);
        return sendCreate(res, SMessage.update);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static deleteYear = (req, res) => {
    try {
      const yUuid = req.params.yUuid;
      if (!yUuid) {
        return sendError(res, 400, "year is reqiured!");
      }
      const deletePart = "DELETE From year WHERE yUuid =?";
      con.query(deletePart, yUuid, function (err) {
        if (err) return sendError(res, 500, EMessage.server, err);
        return sendSuccess(res, SMessage.delete);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
}
