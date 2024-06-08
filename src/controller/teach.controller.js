import { EMessage, SMessage } from "../service/message.js";
import { sendCreate, sendError, sendSuccess } from "../service/response.js";
import { ValidateData } from "../service/vaildate.js";
import con from "../config/db.js";
import { v4 as uuid } from "uuid";
export default class TeacherController {
  static selectAll = async (req, res) => {
    try {
      const mysql = "select * from teacher";
      con.query(mysql, function (err, result) {
        if (err) throw err;
        return sendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static selectByUser = (req, res) => {
    try {
      const user_id = req.params.user_id;
      const mysql = "select * from teacher where user_id=?";
      con.query(mysql, user_id, function (err, result) {
        if (err) throw err;
        return sendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static selectOne = async (req, res) => {
    try {
      const teacherId = req.params.tUuid;
      if (!teacherId) {
        return sendError(res, 401, "teacherId not found");
      }
      const mysql = "select * from teacher where tUuid=?";
      con.query(mysql, teacherId, function (err, result) {
        if (err) throw err;
        return sendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static insert = async (req, res) => {
    try {
      const userId = req.user;
      const { tID, tType, tName, tSurname, age, gender, tel } = req.body;
      const validate = await ValidateData({
        tID,
        tType,
        tName,
        tSurname,
        age,
        gender,
        tel,
      });
      if (validate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      const check = "Select * from teacher where tID =?";
      con.query(check, tID, function (err1, result) {
        if (err1) throw err1;
        if (result.length > 0) {
          return sendError(res, 400, "Teacher ID is already");
        }
        const mysql = "insert into teacher (tID, tUuid,tType, tName, tSurname, age, gender, tel,user_id,createdAt,updatedAt) values (?,?,?,?,?,?,?,?,?,?,?)";
        const tUuid = uuid();
        var date = new Date()
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");

        con.query(
          mysql,
          [tID, tUuid, tType, tName, tSurname,age, gender, tel, userId, date, date],
          function (err2,result2) {
            if (err2) throw err2;
            if(result2 == null){
              return sendError(res, 500, EMessage.server, error);
            }
            return sendCreate(res, SMessage.insert);
          }
        );
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static updateTeacher = async (req, res) => {
    try {
      const tUuid = req.params.tUuid;
      if (!tUuid) {
        return sendError(res, 401, "teacherId not found");
      }
      const { tType, tName, tSurname, age, gender, tel } = req.body;
      const vaildate = await ValidateData({
        tType,
        tName,
        tSurname,
        age,
        gender,
        tel,
      });
      if (vaildate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + vaildate.join(","));
      }
      const query = "Select * from teacher where tUuid=?";
      var date = new Date()
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");
      con.query(query, tUuid, function (err, result) {
        if (err) return sendError(res, 500, EMessage.server, err);
        if (result.length == 0) {
          return sendError(res, 404, "Teacher not found");
        }
        const update =
          "update teacher set tType=?,tName=?,tSurname=?,age=?,gender=?,tel=?,updatedAt=? where tUuid=?";
        con.query(
          update,
          [tType, tName, tSurname, age, gender, tel, date,tUuid],
          function (err) {
            if (err) return sendError(res, 500, EMessage.server, err);
            return sendSuccess(res, SMessage.update);
          }
        );
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static deleteTeacher = (req, res) => {
    try {
      const tUuid = req.params.tUuid;
      if (!tUuid) {
        return sendError(res, 401, "teacherId not found");
      }
      const query = "Delete from teacher where tUuid=?";
      con.query(query, tUuid, function (err) {
        if (err) return sendError(res, 500, EMessage.server, err);
        return sendSuccess(res, SMessage.delete);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
}
