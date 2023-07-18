import { ProductManager } from "../dao/index.js";
import productModel from "../dao/models/product.model.js"
import {verifyPremiumUser} from "../middlewares/auth.js"

const productManager = new ProductManager();


// Creo esta Ruta solo para actualizar de forma masiva el campo Owner. (La ejecute una vez y listo. Quedo guardada la funcion de backup)

export const updateManyProducts = async (req, res) => {
  const products = await productModel.find();
  const adminMail = "adminCoder@coder.com";
  const result = await productModel.updateMany({},{$set:{owner:adminMail}})
}


// GetProductsController deberá listar todos los productos de la base en La ruta raíz GET /

export const GetProductsController = async (req, res) => {
    const page = req.params.page;
    const limit = req.params.limit;
    const sort = req.params.sort;
    const query = req.params.query;
    const products = await productManager.getProducts(limit, page, sort, query);
    if (isNaN(products.page) || isNaN(products.limit) || products.limit === 0 || products.page === 0){
      res.status(404).send({status: "Error", payload: `Page or Limit must be a number not Zero`});
    } else {
      res.status(201).send({status: "Ok", payload: products})
    }
};

// GetProductByIdController deberá traer sólo el producto con el id proporcionado en La ruta GET /:pid


export const GetProductByIdController = async (req, res) => {
    const pid = JSON.stringify(req.params.pid);
    const products = await productModel.find().lean()
    const productWithSameId = products.some((p) => {
      return JSON.stringify(p._id) === pid;
    });
    if (productWithSameId) {
      const productFind = await productManager.getProductById(JSON.parse(pid));
      res.status(201).send({status: "Ok", payload: productFind});
    } else {
      res.status(404).send({status: "Error", payload: `Product with id ${pid} not found`});
    }
};

// NewProductController deberá agregar un nuevo producto en La ruta raíz POST /

export const NewProductController = async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail} = req.body;
    const newProduct = req.body;
    
    // Muestro error si esta duplicado el CODE
    const products = await productModel.find().lean()
    const productWithSameCode = products.some((p) => {
      return p.code === newProduct.code;
    });
    const owner = req.user.email;
    if (productWithSameCode) {
      res.status(404).send({status: "Error", payload: `Product with the same existing code: ${newProduct.code}`});
    } else {
      productManager.addProduct(title, description, code, price, status, stock, category, thumbnail, owner);
      res.status(201).send({status: "Ok", payload: `The product with code ${newProduct.code} was successfully added`});
    }
};

// UpdateProductController deberá tomar un producto y actualizarlo por los campos enviados desde body en La ruta PUT /:pid 

export const UpdateProductController = async (req, res) => {
    const dataToUpdate = req.body;
    const pid = JSON.stringify(req.params.pid);
    const products = await productModel.find().lean()
    const productWithSameId = products.some((p) => {
      return JSON.stringify(p._id) === pid;
    });
    if (productWithSameId) {
      productManager.updateProduct(JSON.parse(pid), dataToUpdate);
      res.status(201).send({status: "Ok", payload: `The product with id ${pid} was successfully updated`});
    } else {
      res.status(404).send({status: "Error", payload: `Product with id ${pid} not found`});
    }
};

// DeleteProductController deberá eliminar el producto con el pid indicado en La ruta DELETE /:pid 

export const DeleteProductController = async (req, res) => {
    const pid = JSON.stringify(req.params.pid);
    const products = await productModel.find().lean()
    const productWithSameId = products.some((p) => {
      return JSON.stringify(p._id) === pid;
    });
    
    if (productWithSameId) {
      const productToDelete = await productManager.getProductById(JSON.parse(pid));
      const rol = req.user.rol;
      const email = req.user.email;
      const owner = productToDelete.owner; 
      // Chequeo que el usuario Premium solo pueda eliminar su propio producto y no el de alguien mas.
      if (verifyPremiumUser(rol, email, owner)) {
        productManager.deleteProduct(JSON.parse(pid))
        res.status(201).send({status: "Ok", payload: `The product with id ${pid} was successfully Deleted`});
      } else {
        res.status(404).send({status: "Error", payload: `You do not have permissions to delete products that are not yours.`});
      }
    } else {
      res.status(404).send({status: "Error", payload: `Product with id ${pid} not found`});
    }
};

