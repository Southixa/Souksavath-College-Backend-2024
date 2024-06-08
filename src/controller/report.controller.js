import { sendCreate, sendError, sendSuccess } from "../service/response.js";
import { v4 as uuid } from "uuid";
import con from "../config/db.js";
import { EMessage, SMessage } from "../service/message.js";
export default class ReportController {
  static selectAll = async (req, res) => {
    try {
      const mysql = `SELECT rpID,rpUuid,sID,sName,gender,report.createdAt,report.updatedAt
          FROM report
          INNER JOIN student ON report.student_id = student.sUuid`;
      con.query(mysql, function (err, result) {
        if (err) return sendError(res, 500, EMessage.server, err);
        return sendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
  static selectOne = async (req, res) => {
    try {
      const rpUuid = req.params.rpUuid;

      const mysql = `SELECT rpID,rpUuid,sID,sName,gender,report.createdAt,report.updatedAt
          FROM report
          INNER JOIN student ON report.student_id = student.sUuid where rpUuid=?`;
      con.query(mysql, rpUuid, function (err, result) {
        if (err) return sendError(res, 500, EMessage.server, err);
        if (result[0] == null) {
          return sendError(res, 404, "Not Found Report");
        }
        return sendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
  static insert = async (req, res) => {
    try {
      const { student_id } = req.body;
      if (!student_id) {
        return sendError(res, 400, "student id is required");
      }
      const checkStudent = "select sUuid from student where sUuid=?";
      con.query(checkStudent, student_id, function (err, result) {
        if (err) return sendError(res, 500, EMessage.server, err);
        if (result[0] == null) {
          return sendError(res, 404, "Not Found Student ID");
        }
        const rpUuid = uuid();
        var date = new Date()
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");
        const mysql =
          "insert into report (rpUuid,student_id,createdAt,updatedAt) Values (?,?,?,?)";
        con.query(mysql, [rpUuid, student_id, date, date], function (err) {
          if (err) return sendError(res, 404, "Faild Insert");
          return sendCreate(res, SMessage.insert);
        });
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static updateReport = async (req, res) => {
    try {
        const rpUuid = req.params.rpUuid;
      const { student_id } = req.body;
      if (!student_id) {
        return sendError(res, 400, "student id is required");
      }
      const checkStudent = "select sUuid from student where sUuid=?";
      con.query(checkStudent, student_id, function (err, result) {
        if (err) return sendError(res, 500, EMessage.server, err);
        if (result[0] == null) {
          return sendError(res, 404, "Not Found Student ID");
        }
        const rpUuid = uuid();
        var date = new Date()
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");
        const mysql =
          "insert into report (rpUuid,student_id,createdAt,updatedAt) Values (?,?,?,?)";
        con.query(mysql, [rpUuid, student_id, date, date], function (err) {
          if (err) return sendError(res, 404, "Faild Insert");
          return sendCreate(res, SMessage.insert);
        });
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
}
