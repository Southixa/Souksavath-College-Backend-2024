import { EMessage, SMessage } from "../service/message.js";
import { sendCreate, sendError, sendSuccess } from "../service/response.js";
import { ValidateData } from "../service/vaildate.js";
import con from "../config/db.js";
import { v4 as uuid } from "uuid";
export default class SubjectController {
  static selectAll = async (req, res) => {
    try {
      const mysql = `SELECT subject.subID,subject.subUuid,subject.subName,subject.subTime,teacher.tID, teacher.tType,teacher.tName,teacher.tSurname,teacher.tel,subject.createdAt,subject.updatedAt
      FROM subject
      INNER JOIN teacher ON subject.teacher_id = teacher.tUuid`;
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
      const subjectId = req.params.subUuid;
      if (!subjectId) {
        return sendError(res, 400, "subject is reqiured!");
      }

    //   const mysql = `select sub.*, t.* from subject sub
    // inner join (select subID,subUuid,subName,subTime,tID,tType,tName,tSurname,tel,from teacher) t
    // on sub.teacher_id = t.tUuid`;
    const mysql =`SELECT subject.subID,subject.subUuid,subject.subName,subject.subTime,teacher.tID, teacher.tType,teacher.tName,teacher.tSurname,teacher.tel,subject.createdAt,subject.updatedAt
    FROM subject
    INNER JOIN teacher ON subject.teacher_id = teacher.tUuid`;
      con.query(mysql, subjectId, function (err, result) {
        if (err) return sendError(res, 500, EMessage.server, err);
        return sendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };

  static insert = async (req, res) => {
    try {
      const { subName, subTime, teacher_id } = req.body;
      const vaildate = await ValidateData({ subName, subTime, teacher_id });
      if (vaildate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + vaildate.join(","));
      }
      const check = "Select * from teacher where tUuid=?";
      con.query(check, teacher_id, function (err, result) {
        if (err) return sendError(res, 400, "Not Found", err);
        if (result.length == 0) {
          return sendError(res, 404, "Not Found");
        }
        const subUuid = uuid();
        var date = new Date()
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");
        const mysql =
          "insert into subject (subUuid,subName,subTime,teacher_id,createdAt,updatedAt) values (?,?,?,?,?,?)";
        con.query(
          mysql,
          [subUuid, subName, subTime, teacher_id, date, date],
          function (err) {
            if (err) return sendError(res, 500, EMessage.server, err);
            return sendCreate(res, SMessage.insert);
          }
        );
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static updateSubject = async (req, res) => {
    try {
      const subUuid = req.params.subUuid;
      if (!subUuid) {
        return sendError(res, 400, "subject params is required");
      }

      const { subName, subTime, teacher_id } = req.body;
      const validate = await ValidateData({ subName, subTime, teacher_id });
      if (validate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      const checkSubject = "select subUuid from subject where subUuid=?";
      con.query(checkSubject, subUuid, function (errCheckSubject, subject) {
        if (errCheckSubject) return sendError(res, 404, "Not Found Subject");
        if (subject[0]["subUuid"] != subUuid) {
          return sendError(res, 404, "Not Found Subject");
        }
        const checkTeacher = "Select tUuid from teacher where tUuid=?";
        con.query(checkTeacher, teacher_id, function (errTeacher, teacher) {
          if (errTeacher) {
            return sendError(res, 404, "Not Found TeacherID", errTeacher);
          }
          if (teacher[0]["tUuid"] != teacher_id) {
            return sendError(res, 404, "Not Found TeacherID");
          }
          var date = new Date()
            .toISOString()
            .replace(/T/, " ") // replace T with a space
            .replace(/\..+/, "");
          const mysql =
            "update subject set subName =?,subTime=?,teacher_id=?,updatedAt=? where subUuid=?";

          con.query(
            mysql,
            [subName, subTime, teacher_id, date, subUuid],
            function (err) {
              if (err) return sendError(res, 404, "Error Update Subject");
              return sendCreate(res, SMessage.update);
            }
          );
        });
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static deleteSubject = (req, res) => {
    try {
      const subUuid = req.params.subUuid;
      if (!subUuid) {
        return sendError(res, 400, "subject params is required");
      }
      const deleteSubject = "Delete from subject where subUuid=?";
      con.query(deleteSubject, subUuid, function (err) {
        if (err) return sendError(res, 404, "Not Found SubjectID");
        return sendSuccess(res, SMessage.delete);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
}
