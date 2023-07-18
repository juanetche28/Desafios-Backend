import { Router, json } from "express";
import { checkRole, checkAuthenticated} from "../middlewares/auth.js";
import {GetUserController,GetUserByIdController,DeleteUserController, changeRol, uploaderDocuments} from "../controllers/user.controller.js"
import { uploaderDocument } from "../utils.js";

const router = Router();
router.use(json());

// Creo todas mis rutas de Usuarios

router.get("/", GetUserController); // La ruta raíz GET /api/users deberá listar todos los usuarios de la base. (solo para rol admin)

router.get("/:uid", GetUserByIdController); // La ruta GET /:uid deberá traer sólo el usuario con el id proporcionado

router.delete("/:uid", checkRole(["admin"]), DeleteUserController); // La ruta DELETE /uid deberá eliminar el usuario con el uid indicado.

router.put("/premium/:uid", checkRole(["admin"]), changeRol);  // Debera cambiar de rol "user" a "premium" y viceversa

router.put("/:uid/documents", checkAuthenticated , uploaderDocument.fields([{name:"identificacion",maxCount:1}, {name:"domicilio",maxCount:1},{name:"estadoDeCuenta",maxCount:1}]), uploaderDocuments)

export default router;
