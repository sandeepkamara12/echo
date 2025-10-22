import * as yup from "yup";
export const name =
    yup.string()
        .trim()
        .matches(/^[A-Za-z\s]+$/, "Name must contain only letters")
        .required("Name is required");

export const email = yup.string()
    .email("Invalid email format")
    .required("Email is required");

export const registerPassword = yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[!@#$%^&*]/, "Password must contain at least one special character (!@#$%^&*)");

export const loginPassword = yup.string()
    .required("Password is required");

export const mobile = yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .required("Mobile number is required");

export const image = yup
    .mixed()
    .required("Image is required")
    .test("fileType", "Only JPG or PNG files are allowed", (value) => {
        if (!value) return false;
        const file = value instanceof File ? value : value[0];
        if (!file) return false;
        return ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
    })
    .test("fileSize", "File size must be less than 1MB", (value) => {
        const file = value instanceof File ? value : value?.[0];
        return file && file.size <= 1 * 1024 * 1024;
    })