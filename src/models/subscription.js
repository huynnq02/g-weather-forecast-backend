import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  verificationToken: {
    type: String,
    default: null,
  },
});

const Subscription = mongoose.model(
  "subscriptions",
  subscriptionSchema,
  "subscriptions"
);

export default Subscription;
