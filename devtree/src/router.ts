import { Router } from 'express';
import { body } from 'express-validator';
import  {createAccount}  from './handlers';


const router = Router();

/**Autenticacion y Registro */
router.post('/auth/register', 
    body('handle')
    .notEmpty()
    .withMessage('el handle no puede ir vacio'),
    body('name')
    .notEmpty()
    .withMessage('el nombre no puede ir vacio'),
    body('email')
    .isEmail()
    .withMessage('debe colocar un email valido'),
    body('password')
    .isLength({min: 8})
    .withMessage('el password es muy corto, minimo 8 caracteres'),
    createAccount)

export default router; 