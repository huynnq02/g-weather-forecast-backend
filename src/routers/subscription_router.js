import express from "express";
const router = express.Router();

import { SubscriptionController } from "../controllers/subscription_controller.js";

router.post("/send-email", SubscriptionController.sendVerificationEmail);
router.get(
  "/confirm-email/:verificationToken",
  SubscriptionController.confirmEmail
);

export default router;
