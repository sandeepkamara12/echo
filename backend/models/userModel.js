import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true
    },
    is_verified: {
      type: Boolean,
      default:false,
      required: false
    },
    image: {
      type: String,
      default: "",
      required: true
    }
  },
  {
    timestamps: true
  }
);
export default mongoose.model("User", userSchema);
