import { Router } from "express";
import * as authController from "../controllers/auth.controllor.js"

const authRouter = Router();


// POST /api/auth/register
authRouter.post("/register", authController.register);

//POST /api/auth/login
authRouter.post("/log-in", authController.logIn);

//GET /api/auth/get-me
authRouter.get("/get-me", authController.getMe);
//get /api.auth/otpget
authRouter.post("/get-otp",authController.OtpGenerate)

//GET /api/auth/refresh-token
authRouter.get("/refresh-token", authController.refreshToken)

//GET /api/auth/logout
authRouter.get("/log-out", authController.logOut)

//GET /api/auth/all-log-out
authRouter.get("/all-log-out", authController.allLogOut);

//GET /api/auth/verify-email
authRouter.post("/verify-email", authController.verifyEmail)


authRouter.post("/verify-otp-reset", authController.verifyOtpForReset)

//GET /api/auth/verify-email
authRouter.post("/reset-password", authController.resetPassword)

export default authRouter;