import {Router} from "express";
import {passportSignupController, successRegisterController, failureRegisterController, passportGithubSignupController, failureSignupGihubController, successSignupGihubController, passportLoginController, checkCredentials, loginFailController, forgotPasswordController,resetPasswordController, logoutSessionController} from "../controllers/auth.controller.js"

const router = Router();

//rutas de autenticacion "signupStrategy" definida en passport.config
router.post("/signup",passportSignupController,successRegisterController);
router.get("/failure-signup",failureRegisterController);

//rutas de autenticacion "githubSignup" definida en passport.config
router.get("/github", passportGithubSignupController);
router.get("/github-callback",failureSignupGihubController,successSignupGihubController)
   
//rutas de autenticacion "login" definida en passport.config
router.post("/login", passportLoginController, checkCredentials);
router.get("/login-failed",loginFailController);


//rutas de Olvido de contraseña definidas en controllers -> auth.controllers.js
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);


//Borrar toda la sesion del usuario loggeado 
router.get("/logout",logoutSessionController)

export {router as AuthRouter};