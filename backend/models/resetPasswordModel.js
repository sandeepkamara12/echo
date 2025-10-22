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
    }   
  }
);
export default mongoose.model("ResetPassword", resetPasswordSchema);