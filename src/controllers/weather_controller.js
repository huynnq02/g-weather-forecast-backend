import axios from "axios";
import { errorResponse, successReponse } from "../../utils/response_format.js";
import dotenv from "dotenv";

dotenv.config();
const API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE_URL = process.env.WEATHER_API_BASE_URL;
const MAX_FORECAST_DAYS = 14;

export const WeatherController = {
  getWeatherData: async (req, res) => {
    try {
      const { location } = req.query;
      const response = await axios.get(
        `${WEATHER_API_BASE_URL}forecast.json?key=${API_KEY}&q=${location}&days=${MAX_FORECAST_DAYS}`
      );
      if (response.status === 200) {
        res.status(200).json(successReponse(response.data));
      } else {
        res
          .status(response.status)
          .json(errorResponse(response.status, response.statusText));
      }
    } catch (error) {
      // Handle the error here and send an appropriate response
      console.error("Error fetching weather data:", error);
      res.status(500).json(errorResponse(500, "Internal Server Error"));
    }
  },
};
