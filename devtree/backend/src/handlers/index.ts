import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import slugify from "slugify";
import formidable from "formidable";
import cloudinary from "../config/cloudinary";
import { v4 as uuid } from "uuid";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";



export const createAccount = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        const error = new Error('Un usuario con ese email ya esta registrado');
        res.status(409).json({ error: error.message });
        return;
    }

    const handle = slugify(req.body.handle);
    const handleExist = await User.findOne({ handle });
    if (handleExist) {
        const error = new Error('nombre de usuario no disponible');
        res.status(409).json({ error: error.message });
        return;
    }


    const user = new User(req.body);
    user.password = await hashPassword(password);
    user.handle = handle;

    await user.save();

    res.status(201).send({ message: 'Registro creado correctamente' });
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    //revisar si el usuario existe
    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error('Usuario no registrado');
        res.status(404).json({ error: error.message });
        return;
    }

    //comprobar password
    const isPasswordCorrect = await checkPassword(password, user.password.toString());
    if (!isPasswordCorrect) {
        const error = new Error('Password incorrecto');
        res.status(401).json({ error: error.message });
        return;
    }

    const token = generateJWT({ id: user._id });

    res.send(token);

}

export const getUser = async (req: Request, res: Response) => {

    res.json(req.user);


}

export const updateProfile = async (req: Request, res: Response) => {

    try {
        const { description } = req.body;
        const handle = slugify(req.body.handle);
        const handleExist = await User.findOne({ handle });
        if (handleExist && handleExist.email !== req.user.email) {
            const error = new Error('nombre de usuario no disponible');
            res.status(409).json({ error: error.message });
            return;
        }

        //Actualizar el usuario
        req.user.description = description;
        req.user.handle = handle;
        await req.user.save();
        res.status(201).send({ message: 'Perfil actualizado correctamente' });

    } catch (e) {
        const error = new Error('Error al actualizar el perfil');
        res.status(500).json({ error: error.message });

    }
}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({ multiples: false });
    try {
        form.parse(req, (error, fields, files) => {
            console.log(files.file[0].filepath);

            cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async function (error, result) {
                if (error) {
                    const error = new Error('Error al actualizar el perfil');
                    res.status(500).json({ error: error.message });
                }
                if (result) {
                    req.user.image = result.secure_url;
                    await req.user.save();
                    res.json({ image: result.secure_url });
                }

            })
        })

    } catch (e) {
        const error = new Error('Error al actualizar el perfil');
        res.status(500).json({ error: error.message });
    }
}
