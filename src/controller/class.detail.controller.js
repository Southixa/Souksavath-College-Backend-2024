import { EMessage, SMessage } from "../service/message.js";
import { sendCreate, sendError, sendSuccess } from "../service/response.js";
import { ValidateData } from "../service/vaildate.js";
import con from "../config/db.js";
import { v4 as uuid } from "uuid";
export default class ClassDetailController {
  static selectAll = async (req, res) => {
    try {
      // const mysql = `SELECT class_detail.cdID,class_detail.cdUuid,class.cUuid,class.cName,termNo,year.schoolyear,student.sID,student.sName,student.sSurname,major.mName,part.pName,subject.subName,subTime,teacher.tName,teacher.tSurname,teacher.tel,teacher.tType,class_detail.createdAt,class_detail.updatedAt
      // FROM class_detail

      // INNER JOIN class ON class_detail.class_id = class.cUuid
      // INNER JOIN year ON class.year_id = year.yUuid
      // INNER JOIN student ON class_detail.student_id = student.sUuid
      // INNER JOIN major ON class.major_id = major.mUuid
      // INNER JOIN part ON class_detail.part_id = part.pUuid
      // INNER JOIN subject ON class_detail.subject_id = subject.subUuid
      // INNER JOIN teacher ON subject.teacher_id = teacher.tUuid`;
      const mysql = `SELECT cdID, cdUuid,class_id,class.year_id, class.major_id,subject_id,part_id,student_id,subject.teacher_id,class_detail.createdAt,class_detail.updatedAt FROM class_detail 
       INNER JOIN class ON class_detail.class_id = class.cUuid
       INNER JOIN subject ON class_detail.subject_id = subject.subUuid
       INNER JOIN teacher ON subject.teacher_id = teacher.tUuid`
       ;
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
      const cdUuid = req.params.class_id;
      if (!cdUuid) {
        return sendError(res, 400, "class id is reqiured!");
      }
      // const mysql = `SELECT class_detail.cdID,class_detail.cdUuid,class.cName,termNo,year.schoolyear,student.sID,student.sName,student.sSurname,major.mName,part.pName,subject.subName,subTime,teacher.tName,teacher.tSurname,teacher.tel,teacher.tType,class_detail.createdAt,class_detail.updatedAt
      // FROM class_detail
      // INNER JOIN class ON class_detail.class_id = class.cUuid 
      // INNER JOIN year ON class.year_id = year.yUuid 
      // INNER JOIN student ON class_detail.student_id = student.sUuid
      // INNER JOIN major ON class.major_id = major.mUuid
      // INNER JOIN part ON class_detail.part_id = part.pUuid
      // INNER JOIN subject ON class_detail.subject_id = subject.subUuid
      // INNER JOIN teacher ON subject.teacher_id = teacher.tUuid where cdUuid = ?`;
      const mysql = `SELECT cdID, cdUuid,class_id,class.year_id, class.major_id,subject_id,part_id,student_id,subject.teacher_id,class_detail.createdAt,class_detail.updatedAt FROM class_detail 
      INNER JOIN class ON class_detail.class_id = class.cUuid
      INNER JOIN subject ON class_detail.subject_id = subject.subUuid
      INNER JOIN teacher ON subject.teacher_id = teacher.tUuid WHERE cdUuid =?`
      con.query(mysql, cdUuid, function (err, data) {
        if (err) throw err;
        if(!data[0]) return sendError(res,404,EMessage.NotFound + " Class",err)
        return sendSuccess(res, SMessage.selectOne, data);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
  static selectByClassID = async (req, res) => {
    try {
      const cUuid = req.params.cUuid;
      if (!cUuid) {
        return sendError(res, 400, "class id is reqiured!");
      }
      const mysql = `SELECT class_detail.cdID,class_detail.cdUuid,class.cName,termNo,year.schoolyear,student.sID,student.sName,student.sSurname,major.mName,part.pName,subject.subName,subTime,teacher.tName,teacher.tSurname,teacher.tel,teacher.tType,class_detail.createdAt,class_detail.updatedAt
      FROM class_detail
      INNER JOIN class ON class_detail.class_id = class.cUuid 
      INNER JOIN year ON class.year_id = year.yUuid 
      INNER JOIN student ON class_detail.student_id = student.sUuid
      INNER JOIN major ON class.major_id = major.mUuid
      INNER JOIN part ON class_detail.part_id = part.pUuid
      INNER JOIN subject ON class_detail.subject_id = subject.subUuid
      INNER JOIN teacher ON subject.teacher_id = teacher.tUuid where cUuid = ?`;
      con.query(mysql, cUuid, function (err, data) {
        if (err) return sendError(res, 500, EMessage.server, err);
        return sendSuccess(res, SMessage.selectOne, data);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };

  static selectByFilter = async (req, res) => {
    try {
      const { cUuid, mUuid } = req.params;
      const vaildate = await ValidateData({
        cUuid, mUuid
      });
      if (vaildate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + vaildate.join(","));
      }
      const mysql = `SELECT class_detail.cdID,class_detail.cdUuid,class.cName,termNo,year.schoolyear,student.sID,student.sName,student.sSurname,major.mName,part.pName,subject.subName,subTime,teacher.tName,teacher.tSurname,teacher.tel,teacher.tType,class_detail.createdAt,class_detail.updatedAt
      FROM class_detail
      INNER JOIN class ON class_detail.class_id = class.cUuid 
      INNER JOIN year ON class.year_id = year.yUuid 
      INNER JOIN student ON class_detail.student_id = student.sUuid
      INNER JOIN major ON class.major_id = major.mUuid
      INNER JOIN part ON class_detail.part_id = part.pUuid
      INNER JOIN subject ON class_detail.subject_id = subject.subUuid
      INNER JOIN teacher ON subject.teacher_id = teacher.tUuid where cUuid = ? AND class.major_id = ?`;
      con.query(mysql, [cUuid, mUuid],  function (err, data) {
        if (err) return sendError(res, 500, EMessage.server, err);
        return sendSuccess(res, SMessage.selectAll, data);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };

  static insert = async (req, res) => {
    try {
      const { class_id, student_id, part_id, subject_id } = req.body;
      const vaildate = await ValidateData({
        class_id,
        student_id,
        part_id,
        subject_id,
      });
      if (vaildate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + vaildate.join(","));
      }
      const checkClass = "Select * from class where cUuid=?";
      const checkPart = "Select * from part where pUuid=?";
      const checkStudent = "Select * from student where sUuid=?";
      const checkSub = "Select * from subject where subUuid=?";
      const insert = `insert into class_detail (cdUuid,class_id,part_id,subject_id,student_id,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?)`;
      con.query(checkClass, class_id, function (errclass, resultClass) {
        if (errclass) return sendError(res, 404, "Not Found class", errclass);
        if (resultClass.length == 0) {
          return sendError(res, 404, "Not Found class");
        }
        const cdUuid = uuid();
        var date = new Date()
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");
        con.query(checkPart, part_id, function (errPart, part) {
          if (errPart) return sendError(res, 404, "Not Found Part", errPart);
          if (part.length == 0) return sendError(res, 404, "Not Found part");
          con.query(checkStudent, student_id, function (errStudent, student) {
            if (errStudent)
              return sendError(res, 404, "Not Found Student", errStudent);
            if (student.length == 0)
              return sendError(res, 404, "Not Found Student");
            con.query(checkSub, subject_id, function (errSub, sub) {
              if (errSub)
                return sendError(res, 404, "Not Found subject", errSub);
              if (sub.length == 0)
                return sendError(res, 404, "Not Found subject");
              con.query(
                insert,
                [cdUuid, class_id, part_id, subject_id, student_id, date, date],
                function (errInsert) {
                  if (errInsert)
                    return sendError(
                      res,
                      500,
                      "Error Insert Class Detail",
                      errInsert
                    );
                  return sendSuccess(res, SMessage.insert);
                }
              );
            });
          });
        });
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static updateClassDetail = async (req, res) => {
    try {
      const cdUuid = req.params.cdUuid;
      if (!cdUuid) {
        return sendError(res, 400, "class detail params is required");
      }

      const { student_id } = req.body;
      const validate = await ValidateData({ student_id });
      if (validate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      const checkStudent = "select * from student where sUuid=?";
      const checkClass = "select * from class_detail where cdUuid=?";

      con.query(checkClass, cdUuid, function (err, result) {
        if (err) return sendError(res, 400, "Not Found", err);
        if (result[0].length == 0) {
          return sendError(res, 404, "Not Found");
        }
        con.query(checkStudent, student_id, function (errStudent, student) {
          if (errStudent) throw errStudent;
          if (student.length == 0) {
            return sendError(res, 404, "Not Found Studnet ID");
          }
          const update = "update class_detail set student_id=? where cdUuid=?";
          con.query(update, [student_id, cdUuid], function (error) {
            if (error) throw error;
            return sendSuccess(res, SMessage.update);
          });
        });
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static deleteClassDetail = (req, res) => {
    try {
      const cdUuid = req.params.cdUuid;
      if (!cdUuid) {
        return sendError(res, 400, "class detail params is required");
      }
      const deleteClass = "Delete from class_detail where cdUuid=?";
      con.query(deleteClass, cdUuid, function (err) {
        if (err) return sendError(res, 404, "Not Found ClassID");
        return sendSuccess(res, SMessage.delete);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
}
