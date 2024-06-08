import { sendError, sendSuccess } from "../service/response.js";

import con from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { EMessage, Role, SMessage } from "../service/message.js";
import {
  GeneratePassword,
  GenerateToken,
  Decrypt,
  UploadImageToServer,
  encrypt,
  GenerateRefreshToken,
} from "../service/service.js";
import { UploadToCloudinary } from "../config/cloudinary.js";
import { ValidateData } from "../service/vaildate.js";

export default class UserController {
  static userOne = (req, res) => {
    try {
      const userId = req.params.userId;
      const mysql = "Select * from user where uuid =?";
      con.query(mysql, userId, function (err, rows) {
        if (err) return sendError(res, 404, EMessage.NotFound, err);
        return sendSuccess(res, SMessage.selectOne, rows[0]);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };

  static userInfo = async (req, res) => {
    try {
      const userId = req.user;
      const mysql = "Select * from user where uuid =?";
      con.query(mysql, userId, function (err, rows) {
        if (err) return sendError(res, 404, EMessage.NotFound, err);
        return sendSuccess(res, SMessage.selectOne, rows[0]);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };

  static selectAll = async (req, res) => {
    try {
      const mysql = "Select * from user";
      con.query(mysql, function (err, result) {
        if (err) return sendError(res, 404, EMessage.NotFound, err);
        return sendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };

  static login = async (req, res) => {
    try {
      // validate data
      const { email, password } = req.body;
      if (!email || !password) {
        return sendError(res, 404, "email and password is required!");
      }
      const mysql = "Select * from user where email =?";

      // query search email
      con.query(mysql, email, async function (err, userData) {
        if (err) return sendError(res, 401, "Not Found", err);

        if (!userData) {
          return sendError(res, 400, "Email not found");
        }

        const decryptPassword = await Decrypt(userData[0]["password"]);

        if (password != decryptPassword) {
          return sendError(res, 401, EMessage.passwordNotMatch);
        }
        var data = {
          id: userData[0]["uuid"],
          role: userData[0]["role"],
        };

        const token = await GenerateToken(data);
        const newData = Object.assign(
          JSON.parse(JSON.stringify(userData[0])),
          JSON.parse(JSON.stringify(token))
        );

        return sendSuccess(res, SMessage.login, newData);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };

  static addRole = async (req, res) => {
    try {
      const { email, password, role } = req.body;
      const validate = await ValidateData({ email, password, role });
      if (validate.length > 0) {
        return sendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      const mysqlEmail = "Select * from user where email =?";
      con.query(mysqlEmail, email, async function (err, result) {
        if (err) return sendError(res, 404, EMessage.NotFound, err);
        if (result[0]) {
          return sendError(res, 400, EMessage.EmailAleardy);
        }
        const allowStatus = Object.values(Role);
        if (!allowStatus.includes(role)) {
          return sendError(
            res,
            400,
            "status must be: " + allowStatus.join(",")
          );
        }
        const genpassword = await GeneratePassword(password);
        const uuid = uuidv4();
        var date = new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");
        console.log(date);

        var mysql =
          "INSERT INTO user (uuid,email,password,role,createdAt,updatedAt) VALUES (? ,?, ?, ?, ?, ?)";

        con.query(
          mysql,
          [uuid, email, genpassword, role, date, date],
          async function (err) {
            if (err) return sendError(res, 404, EMessage.NotFound, err);

            return sendSuccess(res, SMessage.register);
          }
        );
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static register = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return sendError(res, 400, "email and password is required!");
      }

      const mysqlEmail = "Select * from user where email =?";
      con.query(mysqlEmail, email, async function (err, result) {
        if (err) return sendError(res, 404, EMessage.NotFound, err);
        if (result[0]) {
          return sendError(res, 400, EMessage.EmailAleardy);
        }
        // const image_url = await UloadToCloudinary(image.profile.data);
        // const image_url = await UploadToCloudinary(image.profile.data);
        const genpassword = await GeneratePassword(password);

        const uuid = uuidv4();
        var date = new Date()
          .toISOString()
          .replace(/T/, " ") // replace T with a space
          .replace(/\..+/, "");
        console.log(date);

        var mysql =
          "INSERT INTO user (uuid,email,password,role,createdAt,updatedAt) VALUES (? ,?, ?, ?, ?, ?)";

        con.query(
          mysql,
          [uuid, email, genpassword, Role.student, date, date],
          async function (err, result) {
            if (err) return sendError(res, 404, EMessage.NotFound, err);

            return sendSuccess(res, SMessage.register);
          }
        );
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: EMessage.server, error });
    }
  };

  static forgotPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) {
        return sendError(res, 400, "email and newPassword is required!");
      }
      const mysqlEmail = "Select email from user where email =?";
      con.query(mysqlEmail, email, async function (err, result) {
        if (err) return sendError(res, 404, EMessage.NotFound, err);

        if (
          result[0] == undefined ||
          result[0] == null ||
          result[0] == [] ||
          result[0].length == 0
        ) {
          return sendError(res, 404, "email not found!");
        }
        const genpassword = await GeneratePassword(newPassword);
        const forgot = "UPDATE user set password =? WHERE email =?";

        con.query(forgot, [genpassword, email], function (error, success) {
          if (error) return sendError(res, 404, EMessage.NotFound, err);
          return sendSuccess(res, "Forgot Success");
        });
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static changePassword = (req, res) => {
    try {
      const userId = req.user;
      const { newPassword, oldPassword } = req.body;
      if (!newPassword || !oldPassword) {
        return sendError(res, 400, "newPassword and oldPassword is required!");
      }
      const mysql = "Select * from user where uuid =?";
      con.query(mysql, userId, async function (err, result) {
        if (err) return sendError(res, 404, EMessage.NotFound, err);

        const decryptPassword = await Decrypt(result[0]["password"]);
        if (oldPassword != decryptPassword) {
          return sendError(res, 400, EMessage.passwordNotMatch);
        }
        const password = await GeneratePassword(newPassword);
        const update = "UPDATE user set password =? WHERE uuid =?";
        con.query(update, [password, userId], function (error) {
          if (error) return sendError(res, 404, EMessage.NotFound, err);

          return sendSuccess(res, SMessage.update);
        });
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static updateProfile = async (req, res) => {
    try {
      const userId = req.user;
      const { email } = req.body;
      if (!email) {
        return sendError(res, 400, "email is required!");
      }
      const mysql = "Select * from user where uuid =?";
      const image = req.files;
      if (!image) {
        return sendError(res, 400, "profile is required!");
      }
      const image_url = await UploadToCloudinary(image.profile.data);
      if (!image_url) {
        return sendError(res, 404, "Error Upload Profile!");
      }
      con.query(mysql, userId, async function (err, result) {
        if (err) return sendError(res, 500, EMessage.server, err);
        if (email == result[0]["email"]) {
          return sendError(res, 400, EMessage.EmailAleardy);
        }
        const update = "UPDATE user set email =? profile=?, WHERE uuid =?";
        con.query(update, [email, image_url, userId], function (error) {
          if (error) return sendError(res, 404, EMessage.NotFound, err);
          return sendSuccess(res, SMessage.update);
        });
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };

  static refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return sendError(res, 400, "refreshToken is required!");
      }
      const data = await GenerateRefreshToken(refreshToken);
      return sendSuccess(res, "Success", data);
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static deleteUser = (req, res) => {
    try {
      const userId = req.params.userId;
      const mysql = `DELETE FROM user WHERE uuid = ?`;
      con.query(mysql, userId, function (err) {
        if (err) return sendError(res, 404, EMessage.NotFound, err);
        return sendSuccess(res, SMessage.delete);
      });
    } catch (error) {
      return sendError(res, 500, EMessage.server, error);
    }
  };
  static searchUser = (req, res) => {
    try {
    } catch (error) {}
  };
}
