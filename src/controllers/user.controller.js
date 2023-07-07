import { UserManager } from "../dao/index.js";
import { userModel } from "../dao/models/user.model.js"

const userManager = new UserManager();

// Importo de mi base de datos "Products.json" los productos guardados

// GetUserController deberá listar todos los usuaros de la base en La ruta raíz GET /users

export const GetUserController = async (req, res) => {
    // const page = req.params.page;
    // const limit = req.params.limit;
    // const sort = req.params.sort;
    // const query = req.params.query;
    const users = await userManager.getUsers();
    // if (isNaN(users.page) || isNaN(users.limit) || users.limit === 0 || users.page === 0){
    //   res.status(404).send({status: "Error", payload: `Page or Limit must be a number not Zero`});
    // } else {
      res.status(201).send({status: "Ok", payload: users})
    // }
};


// GetUserByIdController deberá traer sólo el usuario con el id proporcionado en La ruta GET /:uid


export const GetUserByIdController = async (req, res) => {
    const uid = JSON.stringify(req.params.uid);
    const user = await userModel.find().lean()
    const userWithSameId = user.some((u) => {
      return JSON.stringify(u._id) === uid;
    });
    if (userWithSameId) {
      const userFind = await userManager.getUserById(JSON.parse(uid));
      res.status(201).send({status: "Ok", payload: userFind});
    } else {
      res.status(404).send({status: "Error", payload: `User with id ${uid} not found`});
    }
};


// DeleteUserController deberá eliminar el usuario con el uid indicado en La ruta DELETE /:uid 

export const DeleteUserController = async (req, res) => {
    const uid = JSON.stringify(req.params.uid);
    const user = await userModel.find().lean()
    const userWithSameId = user.some((u) => {
      return JSON.stringify(u._id) === uid;
    });
    if (userWithSameId) {
      userManager.deleteUser(JSON.parse(uid))
      res.status(201).send({status: "Ok", payload: `The User with id ${uid} was successfully Deleted`});
    } else {
      res.status(404).send({status: "Error", payload: `User with id ${uid} not found`});
    }
};

export const changeRol = async (req, res) => {
  const uid = JSON.stringify(req.params.uid);
  const userFind = await userManager.getUserById(JSON.parse(uid));
  var user = await userModel.find().lean()
  const userExist = user.some((u) => {
    return JSON.stringify(u._id) === uid;
  });
  if (userExist) {
    const rol = userFind.rol;
    const email = userFind.email;
    if (rol === "premium") {
      const dataToUpdate = {rol: "user"};
      userManager.updateUser(JSON.parse(uid), dataToUpdate);  
      res.status(201).send({status: "Ok", payload: `The User with email ${email}, now has rol: ${dataToUpdate.rol}`});
    } else if (rol === "user") {
      const dataToUpdate = {rol: "premium"};
      userManager.updateUser(JSON.parse(uid), dataToUpdate);  
      res.status(201).send({status: "Ok", payload: `The User with email ${email}, now has rol: ${dataToUpdate.rol}`});
    } else {
      res.status(404).send({status: "Error", payload: `You cannot change the role of an admin user.`});
    }
  } else { 
    res.status(404).send({status: "Error", payload: `User with id ${uid} not found`});
  }
}
