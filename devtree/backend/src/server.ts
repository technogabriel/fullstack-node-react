import express from 'express'; //CSJ CommonJs
import 'dotenv/config';
import cors from 'cors'; //CSJ CommonJs
import router from './router';
import {connectDB} from './config/db';
import { corsConfig } from './config/cors';

//conexion a la BD
connectDB();

const app = express();

//cors
app.use(cors(corsConfig));

//Leer datos del formulario
app.use(express.json());


app.use('/', router);


export default app; //exportar app para poder usarlo en otros archivos