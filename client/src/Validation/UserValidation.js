import * as yup from "yup";

export const userSchemaValidation = yup.object().shape({
  name: yup.string().required("Name is required"),

  email: yup

    .string()

    .email("Not valid email format")

    .required("Email is required"),

  password: yup

    .string()

    .min(6, "Minimum 6 characters")

    .max(20, "Maximum 20 characters")

    .required("Password is required"),

  confirmPassword: yup

    .string()

    .oneOf([yup.ref("password"), null], "Passwords Don't Match")

    .required("Confirm Password is required"),
});
