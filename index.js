//declaro los paquetes que voy a utilizar
const express = require('express');
const mysql = require('mysql');
const util = require('util');

//declaro la variable app para utilizar el express.
var app = express();

//declaro el puerto que voy a utilizar para la conexion
const port = 3000;

//uso de los datos atraves de URL
app.use(express.urlencoded());

//mapeo de petición a JSON 
app.use(express.json());

//desarrollo de las consultas

app.get('/peliculas', async(req, res) => {
    try {
        let query = 'SELECT * FROM peliculas'; //declaro la consulta

        const answer = await qy(query); //capturo la consulta

        //resultado en la consola.
        console.log('Impresión de la consulta por consola: ', answer);

        //resultado en el browser
        res.send({ 'Impresión por HTML: ': answer });

    } catch (e) { //atrapo el error en el metodo
        console.log(e.message); //imprimo por consola
        res.status(413).send({ 'Error por Html: ': e.message }); //imprimo por html.
    }
});

app.post('/peliculas', async(req, res) => {
    try {
        let query = 'INSERT INTO peliculas (id, titulo, genero) VALUE (?, ?, ?)';

        const answer = await qy(query, [req.body.id, req.body.titulo, req.body.genero]);

        console.log('Impresión por consola de la carga: ' + answer);

        res.send('Impresión por pagina de la carga:' + answer);

    } catch (e) {
        console.log(e.message); //imprimo por consola
        res.status(413).send({ 'Error por Html: ': e.message }); //imprimo por html.
    }
});




//creo la conexion a la base de datos.
const conn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'recomendados',
});
//manejo el posible error en la conexcion.
conn.connect((error) => {
    if (error) throw error;
    console.log('La Conexión a la base de datos se realizó con exito.');
});


//permitir el uso se async await para uso ordenado al generar las query
//transforma las query en promise para usar async await y manejar el asincronismo

const qy = util.promisify(conn.query).bind(conn);




app.listen(port, () => {
    console.log('Servidor operando en el puerto: ', port);
});