import * as Yup from "yup";

export const signinSchema = Yup.object({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const signupSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  name: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
  phone: Yup.string().optional(),
});

export const forgetPasswordSchema = Yup.object({
  email: Yup.string().email().required("Email is required"),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

export const uploadProductSchema = Yup.object({
  orderPerDay: Yup.string().min(1, "Order Per Day must be at least 1 character").required("Enter Order Per Day"),
  platform: Yup.string().required("Enter Platform"),
  destination: Yup.string().required("Destination is required"),
  note: Yup.string().optional(),
  productName: Yup.string().required("Enter Product Name"),
  imageLink: Yup.mixed()
    .test(
      "is-url-or-file",
      "Image Link Required",
      (value) => typeof value === "string" || value instanceof File
    )
    .test("is-aliexpress-url", "URL not Correct", (value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes("http");
      }
      return true;
    })
    .required("Image Link is required"),
});
