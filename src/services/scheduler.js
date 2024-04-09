import Subscription from "../models/subscription.js";
import cron from "node-cron";
import axios from "axios";
console.log("Schedule is working");
import dotenv from "dotenv";
import { TransporterService } from "./transporter.js";
import crypto from "crypto";
dotenv.config();
const API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE_URL = process.env.WEATHER_API_BASE_URL;
const BASE_URL = process.env.BASE_URL;
const generateRandomString = () => {
  return crypto.randomBytes(20).toString("hex");
};
const sendNewInfo = async () => {
  try {
    const subscriptions = await Subscription.find({}, "email location");
    console.log("Subscriptions: " + subscriptions);
    for (const { email, location } of subscriptions) {
      const verificationToken = generateRandomString();
      const response = await axios.get(
        `${WEATHER_API_BASE_URL}current.json?key=${API_KEY}&q=${location}`
      );

      if (response.status === 200) {
        const weatherData = response.data;

        const weatherUpdate = `
Weather update for ${weatherData.location.name}:
- Temperature: ${weatherData.current.temp_c}°C (${weatherData.current.temp_f}°F)
- Condition: ${weatherData.current.condition.text}
- Wind: ${weatherData.current.wind_kph} km/h from ${weatherData.current.wind_dir}
- Pressure: ${weatherData.current.pressure_mb} mb
- Humidity: ${weatherData.current.humidity}%
- UV Index: ${weatherData.current.uv}
- Visibility: ${weatherData.current.vis_km} km (${weatherData.current.vis_miles} miles)

Don't want to receive these emails anymore? You can unsubscribe at any time by clicking the following link: ${BASE_URL}subscription/unsubscribe/${verificationToken}

        `;
        const mailOptions = {
          from: "Weather <huyy.802@gmail.com>",
          to: email,
          subject: "Weather - Thời tiết hôm nay",
          text: weatherUpdate,
        };
        await Subscription.updateOne(
          { email },
          { $set: { verificationToken } }
        );
        TransporterService.transporter.sendMail(
          mailOptions,
          async (error, info) => {
            if (error) {
              console.error(`Error sending email to ${email}:`, error);
            } else {
              console.log(`Weather forecast sent to ${email}`);
            }
          }
        );
        console.log(
          `Sending weather data to ${email} for location ${location}`
        );
      } else {
        console.error(
          `Error fetching weather data for ${location}: ${response.statusText}`
        );
      }
    }
  } catch (error) {
    console.error("Error sending new information:", error);
  }
};
sendNewInfo();

cron.schedule(
  "0 0 * * *",
  () => {
    sendNewInfo();
  },
  {
    timezone: "Asia/Ho_Chi_Minh",
  }
);
