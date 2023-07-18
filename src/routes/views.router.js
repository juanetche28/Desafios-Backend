import { Router } from "express";
import productModel from "../dao/models/product.model.js"
import { userModel } from "../dao/models/user.model.js"
import { CartManager } from "../dao/index.js";

const cartManager = new CartManager();
const router = Router();


router.get("/", async (req, res) => {
  const {page} = req.query;
  const products = await productModel.paginate(
    {},
    {
      limit: 6,
      lean: true,
      page: page ?? 1,
    }
    );  
  res.render("products", {products});  
});

router.get("/api/users", async (req, res) => {
  const {page} = req.query;
  const users = await userModel.paginate(
    {},
    {
      limit: 3,
      lean: true,
      page: page ?? 1,
    }
    ); 
  res.render("users", {users});  
});


router.get("/carts/:cid", async (req, res) => {
  const cid = JSON.stringify(req.params.cid);
  const carts = await cartManager.getCarts();
  const cartWithSameId = carts.some((p) => {
    return JSON.stringify(p._id) === cid;
  });
  if (cartWithSameId) { // Confirmo que encontre un carrito con el CID especificado
    const cartfind2 = await cartManager.getCartById(JSON.parse(cid))
    const cartfind = cartfind2.products;
    res.render("carts", {cartfind});  
  } else {
    res.status(404).send({status: "Error", payload: `Cart with id ${JSON.parse(cid)} not found`});
  }
});

router.get("/chat", async (req, res) => {
    res.render("chat");
  });

  router.get("/login",(req,res)=>{
    res.render("login");
});

router.get("/signup",(req,res)=>{
    res.render("registro");
});

router.get("/profile",(req,res)=>{
  if (!req.user) {
    return res.status(401).send('Please, you must Log In first. <a href="/login">Sign In</a>'); 
  }
  const data = {
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    rol: req.user.rol
  };
  res.render("profile", data);
});

router.get("/logout",(req,res)=>{
  res.render("logout");
});


router.get("/forgot-password",(req,res)=>{
  res.render("forgotPassword");
});

router.get("/reset-password",(req,res)=>{
  const token = req.query.token;
  res.render("resetPassword",{token});
});

export default router;
