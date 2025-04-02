import colors from 'colors';
import server from './server'


//seteando el puerto que lo tome del archivo .env
const port = process.env.PORT || 4000;

server.listen(port , () => {
    console.log(colors.blue.bold(`Server is running on port: ${port}`));
})