import Subscription from "../models/subscription.js";
import cron from "node-cron";
console.log("Schedule is working");
const sendNewInfo = async () => {
  try {
    const subscriptions = await Subscription.find({}, "email location");

    for (const { email, location } of subscriptions) {
      const response = await axios.get(
        `${WEATHER_API_BASE_URL}current.json?key=${API_KEY}&q=${location}`
      );

      if (response.status === 200) {
        const weatherData = response.data;
        const mailOptions = {
          from: "Huy Weather <huyy.802@gmail.com>",
          to: email,
          subject: "Weather - Thời tiết hôm nay",
          text: `Weather update for ${location}: ${JSON.stringify(
            weatherData
          )}`,
        };
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

cron.schedule(
  "0 0 * * *",
  () => {
    sendNewInfo();
  },
  {
    timezone: "Asia/Ho_Chi_Minh",
  }
);
