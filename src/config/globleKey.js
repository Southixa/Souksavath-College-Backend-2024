import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 8080;
const URL_DATABASE = process.env.URL_DATABASE;
const DATABASE_USER = process.env.DATABASE_NAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;
const SECREAT_KEY = process.env.SECREAT_KEY;
export {
  PORT,
  URL_DATABASE,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  SECREAT_KEY,
};
