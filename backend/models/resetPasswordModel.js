import mongoose from "mongoose";
const resetPasswordSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref:'User'
    },
    token: {
      type: String,
      required: true,
    },
    timestamp:{
      type: Date,
      default:Date.now,
      required: true,
      get: timestamp => timestamp.getTime(),
      set: timestamp => new Date(timestamp)
    }   
  }
);
export default mongoose.model("ResetPassword", resetPasswordSchema);