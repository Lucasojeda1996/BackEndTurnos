import express from "express"
import AuthController from "../controllers/auth.controller.js"
import verifyRecoveryTokenMiddleware from "../middleware/verifyRecoveryToken.middleware.js"

const auth_router = express.Router()

auth_router.post("/register", AuthController.register)
auth_router.post("/login", AuthController.login)
auth_router.get("/verify-email/:verification_token", AuthController.verifyEmail)

auth_router.post("/recovery", AuthController.sendRecoveryEmail)
auth_router.post("/reset-password/:recovery_token", AuthController.resetPassword)

auth_router.post("/reset-password/:recovery_token",verifyRecoveryTokenMiddleware,AuthController.resetPassword);



export default auth_router