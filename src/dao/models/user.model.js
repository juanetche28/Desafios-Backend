import mongoose from 'mongoose';
import { cartCollection } from "./cart.model.js";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    email: {
        type: String,
        unique:true,
        required:true
    },
    age: {
        type: Number,
    },
    password: {
        type:String,
        required:true
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: cartCollection,
    },
    rol: {
        type: String,
        required:true,
        enum:["user","admin","premium"],
        default: 'user',
    }
});

userSchema.plugin(mongoosePaginate);

export const userModel = mongoose.model("users",userSchema);