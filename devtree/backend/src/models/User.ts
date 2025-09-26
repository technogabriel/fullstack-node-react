import mongoose, { Schema, Document }  from "mongoose";

export interface IUser extends Document {
    handle: string,
    name: String,
    email: String,
    password: String
    description: String

}

const userSchema = new Schema({
    handle: {
        type:String,
        required:true,
        trim:true,
        lowercase: true,
        unique:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type: String,
        default : ''
    }
});

const User = mongoose.model<IUser>('User', userSchema); //<> generics

export default User;
