import express from "express";
import User from "../models/user.js";
import Subscription from "../models/subscription.js";
import { errorResponse, successReponse } from "../../utils/response_format.js";
import { TransporterService } from "../services/transporter.js";
import dotenv from "dotenv";
import res from "express/lib/response.js";
import { EMAIL_CONFIRMATION_SUCCEED_FORM, EMAIL_SUBSCRIPTION_FORM, EMAIL_UNSUBCRIPTION_SUCCEED_FORM } from "../../utils/email_form_html.js";
dotenv.config();
const BASE_URL = process.env.BASE_URL
const generateToken = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  const length = 50; // Length of the token

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }

  return token;
};

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: "Weather <huyy.802@gmail.com>",
      to: email,
      subject: "Weather - Xác minh địa chỉ email",
      html: EMAIL_SUBSCRIPTION_FORM(BASE_URL, verificationToken),
    };
    TransporterService.transporter.sendMail(
      mailOptions,
      async (error, info) => {
        if (error) {
          return false;
        } else {
          console.log(
            `Verification email sent to ${email} with token: ${verificationToken}`
          );
          return true;
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(error.message);
  }
};

export const SubscriptionController = {
  sendVerificationEmail: async (req, res) => {
    try {
      const { email, location } = req.body;

      const existingSubscription = await Subscription.findOne({ email });

      if (!existingSubscription) {
        const existingUser = await User.findOne({ email });
        const verificationToken = generateToken();
        if (!existingUser) {
          const newUser = await User.create({
            email: email,
            location: location,
          });
          newUser.verificationToken = verificationToken;
          await newUser.save();
        } else {
          existingUser.location = location;
          existingUser.verificationToken = verificationToken;
          await existingUser.save();
        }
        await sendVerificationEmail(email, verificationToken);
        res
          .status(200)
          .json({ message: "Verification email sent successfully" });
      } else {
        res.status(400).json({ error: "Email is already registered" });
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  confirmEmail: async (req, res) => {
    try {
      const { verificationToken } = req.params;
      console.log(verificationToken);
      const user = await User.findOne({ verificationToken });

      if (!user) {
        throw new Error("Invalid verification token");
      }
      user.emailVerified = true;
      user.verificationToken = null;
      await user.save();
      await Subscription.create({ email: user.email, location: user.location });
      // res.status(200).json(successReponse("Email confirmed successfully"));
      const successMessage = EMAIL_CONFIRMATION_SUCCEED_FORM;

      res.status(200).send(successMessage);
    } catch (error) {
      console.error("Error confirming email:", error);
      res.status(500).json(errorResponse(500, "Internal Server Error"));
    }
  },
  unsubscribe: async (req, res) => {
    try {
      const { verificationToken } = req.params;
      const subscription = await Subscription.findOne({ verificationToken });

      if (subscription) {
        await Subscription.findOneAndDelete({ verificationToken });
        const successMessage = EMAIL_UNSUBCRIPTION_SUCCEED_FORM;
        res.status(200).send(successMessage);
      } else {
        res.status(404).json({ error: "Subscription not found" });
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
