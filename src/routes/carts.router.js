import { Router, json } from "express";
import { checkRole } from "../middlewares/auth.js";
import {viewCartsController, newCartController, productsCartController, updateCartController, updateQtyProductController, addOneUnitProductController, deleteProductController, deleteAllProductsController, purchaseUser} from "../controllers/carts.controller.js"


const router = Router();
router.use(json());

router.get("/", viewCartsController); // Muestro todos los carritos

router.post("/", newCartController); //La ruta raíz POST / deberá crear un nuevo carrito

router.get("/:cid", productsCartController); // La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.

router.put("/:cid", checkRole(["user"]), updateCartController); // PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos.

router.put("/:cid/product/:pid", checkRole(["user"]), updateQtyProductController); //PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body

router.post("/:cid/product/:pid", checkRole(["user", "premium"]), addOneUnitProductController); //La ruta POST /:cid/product/:pid deberá agregar una unidad del producto al arreglo “products” del carrito seleccionado

router.delete("/:cid/product/:pid", checkRole(["user"]), deleteProductController); // DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.

router.delete("/:cid", checkRole(["user"]), deleteAllProductsController); // DELETE api/carts/:cid deberá eliminar todos los productos del carrito

router.post("/:cid/purchase", purchaseUser); // "/:cid/purchase" debera generar la compra del carrito "cid" con su respectivo ticket


export default router;
