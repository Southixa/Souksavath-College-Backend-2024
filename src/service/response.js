// http status success
export const sendCreate = (res, message, data) => {
  res.status(201).json({ success: true, message, data }); // http Code 201 Bad Request
};
export const sendSuccess = (res, message, data) => {
  res.status(200).json({ success: true, message, data }); // http Code 200 Ok
};
// http status clien error
export const sendError = (res, statusCode,message, error) => {
  res.status(statusCode).json({ success: false, message, error, data: {} }); // http Code 200 Ok
};
