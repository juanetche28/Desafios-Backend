import { CartManager } from "../dao/index.js";
import cartModel from "../dao/models/cart.model.js";
import { ticketsModel } from "../dao/models/ticket.model.js";
import {v4 as uuidv4} from 'uuid';
import {transporter} from "../utils/email.js"
import productModel from "../dao/models/product.model.js";
import __dirname from "../utils.js";
import { ProductManager } from "../dao/index.js";
import {verifyPremiumUser} from "../middlewares/auth.js"

const productManager = new ProductManager();
const cartManager = new CartManager();


// viewCartsController debera Mostrar todos los carritos con la ruta GET /

export const viewCartsController = async (req, res) => {
    const carts = await cartManager.getCarts();
    res.status(201).send({status: "Ok", payload: carts});
};
  
// newCartController deberá crear un nuevo carrito de La ruta raíz POST /

export const newCartController = async (req, res) => {
    const products = [];
    await cartManager.addCart(products)
    res.status(201).send({status: "Ok", payload: `Cart created successfully.`});
};

// productsCartController deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados de La ruta GET /:cid

export const productsCartController = async (req, res) => {
    const cid = JSON.stringify(req.params.cid);
    const carts = await cartManager.getCarts();
    const cartWithSameId = carts.some((p) => {
      return JSON.stringify(p._id) === cid;
    });
    if (cartWithSameId) { // Confirmo que encontre un carrito con el CID especificado
      const cartFind = await cartManager.getCartById(JSON.parse(cid));
      res.status(201).send({status: "Ok", payload: cartFind.products});
    } else {
      res.status(404).send({status: "Error", payload: `Cart with id ${JSON.parse(cid)} not found`});
    }
};
  
// updateCartController deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba de la ruta PUT api/carts/:cid 

export const updateCartController = async (req, res) => {
    const dataToUpdate = req.body;
    const cid = JSON.stringify(req.params.cid);
    const carts = await cartManager.getCarts();
    const cartWithSameId = carts.some((p) => {
      return JSON.stringify(p._id) === cid;
    });
    if (cartWithSameId) { // Confirmo que encontre un carrito con el CID especificado
      const cartUpdated = await cartManager.addArrayProducts(JSON.parse(cid), dataToUpdate);
      res.status(201).send({status: "Ok", payload: `update successfully cart id ${JSON.parse(cid)}`});
    } else {
      res.status(404).send({status: "Error", payload: `Cart with id ${JSON.parse(cid)} not found`});
    }
};
  

// updateQtyProductController deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body de la ruta PUT api/carts/:cid/products/:pid 

export const updateQtyProductController = async (req, res) => {
    const cid = JSON.stringify(req.params.cid);
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    if (isNaN(quantity)) {
      res.status(404).send({status: "Error", payload: `Quantity is Not a Number, please use the correct Format {"quantity": 1}`});
    } else {
      const carts = await cartManager.getCarts();
      const cartWithSameId = carts.some((p) => {
        return JSON.stringify(p._id) === cid;
      });
      if (cartWithSameId) { // Confirmo que encontre un carrito con el CID especificado
        await cartManager.addProductQty(JSON.parse(cid), pid, quantity)
        res.status(201).send({status: "Ok", payload: `update successfully, cart id ${JSON.parse(cid)} and product id ${pid}`});
      } else {
        res.status(404).send({status: "Error", payload: `Cart with id ${JSON.parse(cid)} not found`});
      }
    }
};

  
// addOneUnitProductController deberá agregar una unidad del producto al arreglo “products” del carrito seleccionado de La ruta POST /:cid/product/:pid 

// Falta hacer check de que el propducto exista!

export const addOneUnitProductController = async (req, res) => {
    const cid = JSON.stringify(req.params.cid);
    const pid = req.params.pid;
    const productToadd = await productManager.getProductById(pid);
    var owner = productToadd.owner;
    var rol = req.user.rol;
    var email = req.user.email;
    const carts = await cartManager.getCarts();
    const cartWithSameId = carts.some((p) => {
      return JSON.stringify(p._id) === cid;
    });
    if (cartWithSameId) { // Confirmo que encontre un carrito con el CID especificado
      if (rol = "premium") {
        if (verifyPremiumUser(rol, email, owner)){  
          // Quiere decir que da true y es dueño del producto -> No puede agregarlo al carrito
          res.status(404).send({status: "Error", payload: `You cannot add your products to the cart.`}); 
        } else {  // Si entra por aca es user o premium pero no dueño del producto -> puede agregar al carrito
          await cartManager.addProduct(JSON.parse(cid), pid)
          res.status(201).send({status: "Ok", payload: `update successfully, cart id ${JSON.parse(cid)} and product id ${pid}`});
        }
      } else { // Si entra por aca, es usuario "user" -> puede agregar cualquier producto
        await cartManager.addProduct(JSON.parse(cid), pid)
        res.status(201).send({status: "Ok", payload: `update successfully, cart id ${JSON.parse(cid)} and product id ${pid}`});
      }
    } else {
        res.status(404).send({status: "Error", payload: `Cart with id ${JSON.parse(cid)} not found`});
    }
};


// deleteProductController deberá eliminar del carrito el producto seleccionado de la ruta DELETE api/carts/:cid/products/:pid

export const deleteProductController = async (req, res) => {
    const cid = JSON.stringify(req.params.cid);
    const pid = JSON.stringify(req.params.pid);
    const carts = await cartManager.getCarts();
    const cartWithSameId = carts.some((p) => {
      return JSON.stringify(p._id) === cid;
    });
    if (cartWithSameId) { // Confirmo que encontre un carrito con el CID especificado
      const cartFind = await cartModel.findById(JSON.parse(cid))
      const productWithSameId = cartFind.products.some((p) => {
        return JSON.stringify(p.pid) === pid;
      });
      if (productWithSameId) {
        const position = cartFind.products.findIndex(search => JSON.stringify(search.pid) === pid)
        if (cartFind.products[position].quantity === 1) {
          cartFind.products.splice(position, 1)
          res.status(201).send({status: "Ok", payload: `Delete successfully product id ${JSON.parse(pid)} from cart id ${JSON.parse(cid)}`});
          cartFind.save();
          } else{
            let updatedProducts;
            updatedProducts = cartFind.products.map((p) => {
              if (JSON.stringify(p.pid) === pid) {
                return {
                  ...p,
                  quantity: p.quantity - 1,
                }
              }
              return p;
            });
            cartFind.products = updatedProducts; 
            cartFind.save();
            res.status(201).send({status: "Ok", payload: `You successfully removed a unit of the product ${JSON.parse(pid)} from the cart ${JSON.parse(cid)}`});
        }
      }
      else {
        res.status(404).send({status: "Error", payload: `Product with id ${JSON.parse(pid)} not found`});
      };
    } else {
      res.status(404).send({status: "Error", payload: `Cart with id ${JSON.parse(cid)} not found`});
    }
};
 
// deleteAllProductsController deberá eliminar todos los productos del carrito de la Ruta DELETE api/carts/:cid

export const deleteAllProductsController = async (req, res) => {
    const cid = JSON.stringify(req.params.cid);
    const carts = await cartManager.getCarts();
    const cartWithSameId = carts.some((p) => {
      return JSON.stringify(p._id) === cid;
    });
    if (cartWithSameId) {  // Confirmo que encontre un carrito con el CID especificado
      const cart = await cartModel.findById(JSON.parse(cid));
      cart.products.splice(0);
      cart.save();
      res.status(201).send({status: "Ok", payload: `You successfully removed all products from the cart ${JSON.parse(cid)}`});
    } else {
      res.status(404).send({status: "Error", payload: `Cart with id ${JSON.parse(cid)} not found`});
    }
};

// purchaseUser debera generar la compra del carrito y emitir un ticket 

export const purchaseUser = async(req,res)=>{
  let amount = 0; // voy a utilizar esta variable para calcular el total de la compra
  try {
      const cartId = req.params.cid;
      const cart = await cartModel.findById(cartId);
      if(cart){
        if(!cart.products.length){
          return res.send("You need to add products before making the purchase.")
        }
        const ticketProducts = [];
        const rejectedProducts = [];
        for(let i=0; i<cart.products.length;i++){
          const cartProduct = cart.products[i];
          const productDB = await productModel.findById(cartProduct.pid);
          //comparar la cantidad de ese producto en el carrito con el stock del producto
          if(cartProduct.quantity<=productDB.stock){
            ticketProducts.push(cartProduct);
          } else {
            rejectedProducts.push(cartProduct);
          }
        }

        // Voy a generar informacion de la compra (guardar datos en el array "purchaseInfo" con todos los productos, nombre, codigo, precio, cantidad)
        const purchaseInfo = []; 
        for(let i=0; i<ticketProducts.length;i++){
          const productsTicket = ticketProducts[i];
          const productDB = await productModel.findById(productsTicket.pid);
          // console.log("productDB", productDB);
          const data = 
            {
              title: productDB.title,
              code: productDB.code,
              price: productDB.price,
              quantity: productsTicket.quantity,
              subtotal: productsTicket.quantity*productDB.price  
            };
          amount = amount + data.subtotal;
          purchaseInfo.push(data);
          data.lenght=0; //reseteo el array Data
        };

        // console.log("purchaseInfo",purchaseInfo)

        const newTicket = {
          code: uuidv4(),
          purchase_datetime: new Date().toLocaleString(),
          purchaseInfo: purchaseInfo,
          amount: amount,
          purchaser:req.user.email
        }
        // Genero un Email agradeciendo la compra al Usuario. en informo el "CODE" como numero de orden por si necesita Reclamar.
        // Armo un template para el cuerpo del mensaje
        const emailTemplate = `<div> 
        <h1>Thanks for your Purchase!!</h1>
        <img src="cid:thanks-purchase"/>
        <p>Number of order: <b>${newTicket.code}</b></p>
        <p>Purchase Total: <b>$ ${amount}</b></p>
        <a href="http://localhost:8080/">Home</a>
        </div>`;
        const contenido = await transporter.sendMail({
        //estructura del correo
        from:"ecommerce Aromas en el Alma",
        to:req.user.email,
        subject:"Successful Purchase",
        html:emailTemplate,
        attachments: [
          {
            filename:"thanks-purchase.gif",
            path:(__dirname,+"/images/thanks-purchase.gif"),
            cid:"thanks-purchase" // Definido en el template
          }
        ]
        });
        const ticketCreated = await ticketsModel.create(newTicket);
        res.send(ticketCreated) 
      } else {
          res.send("Cart not found, please check the Id Cart")
      }
  } catch (error) {
      res.send(error.message)
  }
};