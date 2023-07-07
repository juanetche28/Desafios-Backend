import { Router, json } from "express";
import { checkRole } from "../middlewares/auth.js";
import {GetProductsController, GetProductByIdController, NewProductController, UpdateProductController, DeleteProductController} from "../controllers/products.controller.js"

const router = Router();
router.use(json());

// Creo todas mis rutas de Products

router.get("/:limit/:page/:sort/:query", GetProductsController); // La ruta raíz GET / deberá listar todos los productos de la base.

router.get("/:pid", GetProductByIdController); // La ruta GET /:pid deberá traer sólo el producto con el id proporcionado

router.post("/", checkRole(["admin", "premium"]), NewProductController); // La ruta raíz POST / deberá agregar un nuevo producto

router.put("/:pid", checkRole(["admin"]), UpdateProductController); // La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. 

router.delete("/:pid", checkRole(["admin", "premium"]), DeleteProductController); // La ruta DELETE /:pid deberá eliminar el producto con el pid indicado.

export default router;
