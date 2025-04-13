import express from 'express'; //CSJ CommonJs
import 'dotenv/config';
import router from './router';
import {connectDB} from './config/db';


const app = express();

//Leer datos del formulario
app.use(express.json());
connectDB();

app.use('/', router);



export default app; //exportar app para poder usarlo en otros archivos