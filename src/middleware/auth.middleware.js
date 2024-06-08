import { sendError } from "../service/response.js";
import { VerifyToken } from "../service/service.js";
export const auth = async (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    return sendError(res, 401, "Unauthorized");
  }
  const token = authorization.replace("Bearer ", "");
  if (!token) {
    return sendError(res, 401, "Invaild unathorized");
  }
  const verifyData = await VerifyToken(token);
  if(!verifyData){
    return sendError(res, 401, "Invaild unathorized");
  }
 // console.log(verifyData);
  req.user = verifyData;
  next();
};
