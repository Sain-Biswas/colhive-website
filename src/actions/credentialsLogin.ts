"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

export default async function credentialsLogin(
  email: string,
  password: string
) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "User login successful",
      description: "Sending you to dashboard",
    };
  } catch (error: any) {
    console.log(error);
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        if (error.message.includes("UserNotFoundError")) {
          return {
            success: false,
            message: "User not registered.",
            description: "Please go to signin or contact your organization.",
          };
        } else if (error.message.includes("PasswordError")) {
          return {
            success: false,
            message: "Invalid Password",
            description: "Email and Password didn't match.",
          };
        }
      }
    }

    return {
      success: false,
      message: "Something went wrong!",
      description: "Please try again after some time.",
    };
  }
}
