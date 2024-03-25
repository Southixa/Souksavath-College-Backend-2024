import express from "express";
import "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import route from "./router/index.js";
import { PORT } from "./config/globleKey.js";
const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(
  bodyParser.urlencoded({ 
    extended: true, 
    limit: "500mb", parameterLimit: 500
 })
);
app.use("/api", route);
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
