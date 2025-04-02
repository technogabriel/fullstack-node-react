import type {Request, Response } from "express";
import {validationResult} from "express-validator";
import slugify from "slugify";
import User from "../models/User";
import { hashPassword } from "../utils/auth";



export const createAccount =  async (req: Request, res: Response) => {
//Manejo de errores:
let errors = validationResult(req);
if(!errors.isEmpty()){
    res.status(400).json({errors: errors.array()});
    return;
}
    const {email, password} = req.body;
    
    const userExists = await User.findOne({email});
    
    if(userExists) {
        const error = new Error('Un usuario con ese email ya esta registrado');
         res.status(409).json({error : error.message});
         return;
    }

    const handle = slugify(req.body.handle);
    const handleExist = await User.findOne({handle});
    if(handleExist) {
        const error = new Error('nombre de usuario no disponible');
         res.status(409).json({error : error.message});
         return;
    }


    const user = new User(req.body);
     user.password =  await hashPassword(password);
     user.handle = handle;

    await user.save();

    res.status(201).send( {message :'Registro creado correctamente'});

}