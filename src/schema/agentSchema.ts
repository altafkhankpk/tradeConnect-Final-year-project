import * as Yup from "yup";

export const signinAgentSchema = Yup.object({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const signupAgentSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
  phone: Yup.string().optional(),
});

export const updateUsernameAgentSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
});

export const UsernameAgentSchema = Yup.object({
  username: Yup.string().required("username is required"),
});

export const AboutAgentSchema = Yup.object({
  about: Yup.string().required("about is required"),
});

export const HeadingAgentSchema = Yup.object({
  headline: Yup.string().required("headline is required"),
});

export const ExperienceAgentSchema = Yup.object({
  experience: Yup.string().required("experience is required"),
});

export const CityAgentSchema = Yup.object({
  city: Yup.string().required("city is required"),
});

export const ProfileImageAgentSchema = Yup.object({
  profileImage: Yup.mixed().required("Profile image is required"),
});

export const CoverImageAgentSchema = Yup.object({
  coverImage: Yup.mixed().required("Cover image is required"),
});

export const forgetPasswordAgentSchema = Yup.object({
  email: Yup.string().email().required("Email is required"),
});

export const resetPasswordAgentSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

export const uploadProductAgentSchema = Yup.object({
  orderPerDay: Yup.string().required("Enter Order Per Day"),
  platform: Yup.string().required("Enter Plateform"),
  // imageLink: Yup.string().required("Image Link Required"),
  destination: Yup.string().required("destination is required"),
  note: Yup.string().optional(),
  productName: Yup.string().required("Enter Product Name"),
});
