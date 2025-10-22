import mongoose from "mongoose";
const otpSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    otp: {
      type: Number,
      required: true
    },
    timestamps: {
      type: Date,
      default: Date.now,
      required: true,
      get: (timestamps) => timestamps.getTime(),
      set: (timestamps) => new Date(timestamps)
    }
  }
);
export default mongoose.model("OTP", otpSchema);
