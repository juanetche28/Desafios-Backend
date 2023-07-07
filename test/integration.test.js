import chai from "chai";
import supertest from "supertest";
import ProductManager from "../src/dao/db-managers/ProductManager.js"
import UserManager from "../src/dao/db-managers/UserManager.js"
import CartManager from "../src/dao/db-managers/CartManager.js"

import {app} from "../src/app.js";

const expect = chai.expect;
const requester = supertest(app);
const userTest = "Fangio@gmail.com";

describe("Testing de App eCommerce",()=>{

    describe("Test el modulo de eCommerce",()=>{

        it("El endpoint post /api/products crea un producto correctamente",async function(){
            const productMock = {
                title: "Durazno Actualizado",
                description: "Esto es un Durazno",
                code: "COD004",
                price: 60,
                status: "true",
                stock: 50,
                category: "especiales",
                thumbnail: [
                    "Sin Imagen",
                    "Sin Imagen2_Actualizado"
                ]
            };
            const result = await requester.post("/api/products").send(productMock);
            // console.log("result productMock /api/products", result);
            const {statusCode,_body} = result;
            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal("error"); // Necesitas estar Authenticado
        });

        it("Al crear un producto sólo con los datos elementales se debe corroborar cuente con una propiedad owner",async function(){
            const productMock = {
                title: "Durazno Actualizado",
                description: "Esto es un Durazno",
                code: "COD005",
                price: 60,
                status: "true",
                stock: 50,
                category: "especiales",
                thumbnail: [
                    "Sin Imagen",
                    "Sin Imagen2_Actualizado"
                ]
            };
            const response = await requester.post("/api/products").send(productMock);
            // console.log("Response check", response)
            expect(response.body.payload).to.have.property("owner");
        });

    //     it("Si se desea crear un producto sin el campo title, el módulo debe responder con un status 400.", async function(){
    //         const productMock = {
    //             description: "Esto es un Durazno",
    //             code: "COD006",
    //             price: 60,
    //             status: "true",
    //             stock: 50,
    //             category: "especiales",
    //             thumbnail: [
    //                 "Sin Imagen",
    //                 "Sin Imagen2_Actualizado"
    //             ]
    //         };
    //         const response = await requester.post("/api/products").send(productMock);
    //         expect(response.statusCode).to.be.equal(400);
    //     });
     });

    // describe("Test avazando-flujo autenticacion de un usuario", ()=>{
    //     before(async function(){
    //         this.cookie;
    //         // await userModel.deleteMany({});
    //     });

    //     it("Se debe registrar al usuario correctamente",async function(){
    //         const mockUser = {
    //             firstName:"Juan Manuel",
    //             lastName:"Fangio",
    //             email:"fangio@gmail.com",
    //             password:"1234"
    //         };
    //         const responseSignup = await requester.post("/api/sessions/signup").send(mockUser);
    //         expect(responseSignup.statusCode).to.be.equal(200);
    //     });

    //     it("Debe loguear al usuario y devolver una cookie",async function(){
    //         const mockUserLogin={
    //             email:userTest,
    //             password:"1234"
    //         };
    //         const responseLogin = await requester.post("/api/sessions/login").send(mockUserLogin);
    //         const cookieResponse = responseLogin.headers["set-cookie"][0];
    //         const cookieData={
    //             name:cookieResponse.split("=")[0],
    //             value: cookieResponse.split("=")[1]
    //         }
    //         console.log("cookie", cookieData.name);
    //         this.cookie = cookieData;
    //         expect(this.cookie.name).to.be.equal("coderCookie");
    //     });

    //     it("Al llamar /current obtenemos la cookie y la informacion del usuario",async function(){
    //         const currentResponse = await requester.get("/api/sessions/current").set("Cookie",[`${this.cookie.name}=${this.cookie.value}`]);
    //         // console.log("currentResponse",currentResponse);
    //         expect(currentResponse.body.payload.email).to.be.equal(userTest);
    //     });
    // });

});