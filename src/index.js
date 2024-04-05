//#region import package
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

dotenv.config();

const app = express();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
//#end region

// app.use(bodyParser.json());

//#region setup middleware
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
//#end region

//#region import router
import weatherRouter from "./routers/weather_router.js";
//#end region

//#region setup router
app.use("/api/v1/weather", weatherRouter);
//#end region

//#region start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
//#end region

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello World!",
  });
});
export default app;
