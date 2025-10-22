import { check } from "express-validator";

export const registerUserValidation = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  check("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .isMobilePhone()
    .withMessage("Please enter a valid mobile number")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Mobile number must be Indian 10 digits long"),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character (!@#$%^&*)")
];
//Image validation is in upload Middleware, handling with multer itself


export const sendMailVerification = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
];
export const ResetPasswordVerification = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
];

export const loginUserValidation = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
];

export const updateUserProfileValidation = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  // check("email")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("Email is required")
  //   .isEmail()
  //   .withMessage("Please provide a valid email"),

  check("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .isMobilePhone()
    .withMessage("Please enter a valid mobile number")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Mobile number must be Indian 10 digits long"),

  // check("password")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("Password is required")
  //   .isLength({ min: 8 })
  //   .withMessage("Password must be at least 8 characters long")
  //   .matches(/[a-z]/)
  //   .withMessage("Password must contain at least one lowercase letter")
  //   .matches(/[A-Z]/)
  //   .withMessage("Password must contain at least one uppercase letter")
  //   .matches(/\d/)
  //   .withMessage("Password must contain at least one number")
  //   .matches(/[!@#$%^&*]/)
  //   .withMessage("Password must contain at least one special character (!@#$%^&*)")
];

export const OTPVerificationValidator = [
  check("user_id")
    .trim()
    .notEmpty()
    .withMessage("User id is required"),
  check("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
]