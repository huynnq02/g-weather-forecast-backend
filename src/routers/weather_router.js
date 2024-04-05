import express from "express";
const router = express.Router();

import { WeatherController } from "../controllers/weather_controller.js";

router.get("/", WeatherController.getWeatherData); // GET /api/v1/weather

export default router;
