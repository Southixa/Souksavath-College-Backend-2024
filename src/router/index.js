import express from "express"
import CheckListController from "../controller/checklist.controller.js";
import ClassController from "../controller/class.controller.js";
import ClassDetailController from "../controller/class.detail.controller.js";
import MajorController from "../controller/major.controller.js";
import PartController from "../controller/part.controller.js";
import ReportController from "../controller/report.controller.js";
import StudentController from "../controller/student.controller.js";
import SubjectController from "../controller/subject.controller.js";
import TeacherController from "../controller/teach.controller.js";
import UserController from "../controller/user.controller.js";
import YearController from "../controller/year.controller.js";
import {auth} from "../middleware/auth.middleware.js";
const route = express.Router();
//========= auth =======
route.post("/user/register",UserController.register);
route.post("/user/addRole",UserController.addRole);
route.post("/user/login",UserController.login);
route.put("/user/forgot",UserController.forgotPassword)
route.put("/user/changepassword",auth,UserController.changePassword)
route.put("/user/update",auth,UserController.updateProfile)

route.post("/user/refresh",UserController.refreshToken)
route.delete("/user/delete/:userId",auth,UserController.deleteUser)
route.get("/user/info",auth,UserController.userInfo)
route.get("/user/selectall",auth,UserController.selectAll)
route.get("/user/getOne/:userId",auth,UserController.userOne)

//======== student =====
route.get("/student/selectone/:sID",auth,StudentController.selectOne);
route.get("/student/selectall",auth,StudentController.selectAll);
route.get("/student/selectby/:user_id",auth,StudentController.selectByUserId);
route.post("/student/insert",auth,StudentController.insert);
route.put("/student/update/:sID",auth,StudentController.updateStudent);
route.delete("/student/delete/:sUuid",auth,StudentController.deleteStudent);
//======== teacher ======
route.get("/teacher/selectone/:tUuid",auth,TeacherController.selectOne);
route.get("/teacher/selectall",auth,TeacherController.selectAll);
route.get("/teacher/selectby/:user_id",auth,TeacherController.selectByUser);
route.post("/teacher/insert",auth,TeacherController.insert);
route.put("/teacher/update/:tUuid",auth,TeacherController.updateTeacher);
route.delete("/teacher/delete/:tUuid",auth,TeacherController.deleteTeacher);
//======== part ======
route.get("/part/selectone/:pUuid",auth,PartController.selectOne);
route.get("/part/selectall",auth,PartController.selectAll);
route.post("/part/insert",auth,PartController.insert);
route.put("/part/update/:pUuid",auth,PartController.updatePart);
route.delete("/part/delete/:pUuid",auth,PartController.deletePart);
//======== major ======
route.get("/major/selectone/:mUuid",auth,MajorController.selectOne);
route.get("/major/selectall",auth,MajorController.selectAll);
route.post("/major/insert",auth,MajorController.insert);
route.put("/major/update/:mUuid",auth,MajorController.updateMajor);
route.delete("/major/delete/:mUuid",auth,MajorController.deleteMajor);
//======== year ======
route.get("/year/selectone/:yUuid",auth,YearController.selectOne);
route.get("/year/selectall",auth,YearController.selectAll);
route.post("/year/insert",auth,YearController.insert);
route.put("/year/update/:yUuid",auth,YearController.updateYear);
route.delete("/year/delete/:yUuid",auth,YearController.deleteYear);
//======== checklist ======
route.get("/checklist/selectone/:chUuid",auth,CheckListController.selectOne);
route.get("/checklist/selectall",auth,CheckListController.selectAll);
route.get("/checklist/selectbyclassdetail/:cdUuid",auth,CheckListController.selectByClassDetailID);
route.post("/checklist/insert",auth,CheckListController.insert);
route.put("/checklist/update/:chUuid",auth,CheckListController.updateCheckList);
route.delete("/checklist/delete/:chUuid",auth,CheckListController.deleteCheckList);
//======== subject ======
route.get("/subject/selectall",auth,SubjectController.selectAll);
route.get("/subject/selectone/:subUuid",auth,SubjectController.selectOne);
route.post("/subject/insert",auth,SubjectController.insert);
route.put("/subject/update/:subUuid",auth,SubjectController.updateSubject);
route.delete("/subject/delete/:subUuid",auth,SubjectController.deleteSubject);
//======== class ======
route.get("/class/selectall",auth,ClassController.selectAll);
route.get("/class/selectone/:cUuid",auth,ClassController.selectOne);
route.post("/class/insert",auth,ClassController.insert);
route.put("/class/update/:cUuid",auth,ClassController.updateClass);
route.delete("/class/delete/:cUuid",auth,ClassController.deleteClass);
//======== class detail ======
route.get("/classdetail/selectall",ClassDetailController.selectAll);
route.get("/classdetail/selectone/:class_id",ClassDetailController.selectOne);
route.get("/classdetail/selectbyclassid/:cUuid",auth,ClassDetailController.selectByClassID);
route.get("/classdetail/selectbyfilter/:cUuid/:mUuid",auth,ClassDetailController.selectByFilter);
route.post("/classdetail/insert",auth,ClassDetailController.insert);
route.put("/classdetail/update/:cdUuid",auth,ClassDetailController.updateClassDetail);
route.delete("/classdetail/delete/:cdUuid",auth,ClassDetailController.deleteClassDetail);
//======== report ======
// route.get("/report/selectall",auth,ReportController.selectAll);
// route.get("/report/selectone/:rpUuid",auth,ReportController.selectOne);
// route.post("/report/insert",auth,ReportController.insert);
export default route;