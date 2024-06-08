import { EMessage, SMessage } from "../service/message.js";
import { sendCreate, sendError, sendSuccess } from "../service/response.js";
import con from "../config/db.js";
import { v4 as uuid } from "uuid";
import { ValidateData } from "../service/vaildate.js";
export default class CheckListController {
  static selectAll = async (req, res) => {
    try {
      const mysql = `SELECT checklist.chID,checklist.chUuid,class.cName,year.schoolyear,termNo,student.sID,student.sName,student.sSurname,major.mName,part.pName,subject.subName,subTime,teacher.tName,teacher.tSurname,teacher.tType,checklist.class_detail_id,checklist.status,checklist.reson,checklist.createdAt,checklist.updatedAt,checklist.hourAt,checklist.date
      FROM checklist
      INNER JOIN class_detail ON checklist.class_detail_id = class_detail.cdUuid 
      INNER JOIN class ON class_detail.class_id = class.cUuid 
      INNER JOIN year ON class.year_id = year.yUuid 
      INNER JOIN student ON class_detail.student_id = student.sUuid
      INNER JOIN major ON class.major_id = major.mUuid
      INNER JOIN part ON class_detail.part_id = part.pUuid
      INNER JOIN subject ON class_detail.subject_id = subject.subUuid
      INNER JOIN teacher ON subject.teacher_id = teacher.tUuid`;
      // const mysql = "select * from checklist";
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
      const chUuid = req.params.chUuid;
      if (!chUuid) {
        return sendError(res, 400, "checklist is reqiured!");
      }
      const mysql = `SELECT checklist.chID,checklist.chUuid,class.cName,year.schoolyear,termNo,student.sID,student.sName,student.sSurname,major.mName,part.pName,subject.subName,subTime,teacher.tName,teacher.tSurname,teacher.tType,checklist.status,checklist.statusName,reson,checklist.createdAt,checklist.updatedAt
      FROM checklist
      INNER JOIN class_detail ON checklist.class_detail_id = class_detail.cdUuid 
      INNER JOIN class ON class_detail.class_id = class.cUuid 
      INNER JOIN year ON class.year_id = year.yUuid 
      INNER JOIN student ON class_detail.student_id = student.sUuid
      INNER JOIN major ON class.major_id = major.mUuid
      INNER JOIN part ON class_detail.part_id = part.pUuid
      INNER JOIN subject ON class_detail.subject_id = subject.subUuid
      INNER JOIN teacher ON subject.teacher_id = teacher.tUuid WHERE chUuid =?`;
    
      con.query(mysql, chUuid, function (err, result) {
        if (err) throw err;
        if(result[0] == null){
          return sendError(res,404,"Not Found Checklist")
        }
        return sendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };

  static selectByClassDetailID = async (req, res) => {
    try {
      const cdUuid = req.params.cdUuid;
      if (!cdUuid) {
        return sendError(res, 400, "checklist is reqiured!");
      }
      const mysql = `SELECT checklist.chID,checklist.chUuid,class.cName,year.schoolyear,termNo,student.sID,student.sName,student.sSurname,major.mName,part.pName,subject.subName,subTime,teacher.tName,teacher.tSurname,teacher.tType,checklist.class_detail_id,checklist.status,checklist.reson,checklist.createdAt,checklist.updatedAt,checklist.hourAt,checklist.date
      FROM checklist
      INNER JOIN class_detail ON checklist.class_detail_id = class_detail.cdUuid 
      INNER JOIN class ON class_detail.class_id = class.cUuid 
      INNER JOIN year ON class.year_id = year.yUuid 
      INNER JOIN student ON class_detail.student_id = student.sUuid
      INNER JOIN major ON class.major_id = major.mUuid
      INNER JOIN part ON class_detail.part_id = part.pUuid
      INNER JOIN subject ON class_detail.subject_id = subject.subUuid
      INNER JOIN teacher ON subject.teacher_id = teacher.tUuid WHERE class_detail_id =?`;
    
      con.query(mysql, cdUuid, function (err, result) {
        if (err) throw err;
        if(result[0] == null){
          return sendError(res,404,"Not Found Checklist")
        }
        return sendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };


  static insert = async (req, res) => {
    try {
      const { class_detail_id, status, reson, hourAt, date } = req.body;
      const vaildate = await ValidateData({
        class_detail_id, 
        status, 
        hourAt, 
        date
      });
      if (vaildate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + vaildate.join(","));
      }

      const {err: checkClassDetailIdError, result: checkClassDetailIdResult} = await new Promise((resolve, reject) => {
        const checkClassDetailId = "select * from checklist where class_detail_id=? AND hourAt =? AND date =?";
        con.query(checkClassDetailId, [class_detail_id, hourAt, date], function (err, result) {
          if (err) {
            reject({err});
          } else {
            resolve({result});
          }
        });
      });
      
      if(checkClassDetailIdError) {
        return sendError(res, 404, "Error find checklist class detail id", checkClassDetailIdError);
      }

      if(checkClassDetailIdResult.length > 0) {
        return sendError(res, 404, "Alrealy insert checklist");
      }


      const checkCD = "select * from class_detail where cdUuid=?";
      con.query(checkCD, class_detail_id, function (err, result) {
        if (err) return sendError(res, 404, "Not Found Class Detail");
        if (result[0] == null) {
          return sendError(res, 404, "Not Found Class Detail");
        }
        const mysql =
          "insert into checklist (chUuid,class_detail_id,status,reson,hourAt,date,createdAt,updatedAt) values (?,?,?,?,?,?,?,?)";
        const chUuid = uuid();
        var currentDate = new Date()
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");
        con.query(
          mysql,
          [chUuid, class_detail_id, status, reson, hourAt, date, currentDate, currentDate],
          function (err) {
            if (err) return sendError(res, 404, "Error Insert", err);
            return sendCreate(res, SMessage.insert);
          }
        );
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static updateCheckList = async (req, res) => {
    try {
      const chUuid = req.params.chUuid;
      if (!chUuid) {
        return sendError(res, 400, "checklist params is required");
      }
      const { status, statusName, reson } = req.body;
      const vaildate = await ValidateData({ status, statusName, reson });
      if (vaildate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + vaildate.join(","));
      }
      var date = new Date()
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");
      const mysql =
        "update checklist set status =?,statusName=?,updatedAt=?,reson=? where chUuid=?";

      con.query(
        mysql,
        [status, statusName, date, reson, chUuid],
        function (err) {
          if (err) return sendError(res, 404, "Error Update");
          return sendCreate(res, SMessage.update);
        }
      );
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static deleteCheckList = (req, res) => {
    try {
      const chUuid = req.params.chUuid;
      if (!chUuid) {
        return sendError(res, 400, "checklist is reqiured!");
      }
      const deleteCheckList = "DELETE From checklist WHERE chUuid =?";
      con.query(deleteCheckList, chUuid, function (err) {
        if (err) return sendError(res, 500, EMessage.server, err);
        return sendSuccess(res, SMessage.delete);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server);
    }
  };
}
