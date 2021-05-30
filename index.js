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

//DESARROLLO DE LAS CONSULTAS

//busqueda de todas las peliculas: GET + localhost:3000/peliculas
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

//ingreso de peliculas: POST + localhost:3000/peliculas + json {id, titulo, genero}
app.post('/peliculas', async(req, res) => {
    try {
        let query = 'INSERT INTO peliculas (id, titulo, genero) VALUE (?, ?, ?)';

        const answer = await qy(query, [req.body.id, req.body.titulo, req.body.genero]);


        console.log('Impresión por consola de la carga: ' + answer); //esto imprime bien. 

        res.send('Impresión por pagina de la carga:' + answer); // usarlo mas tarde para imprimir confirmación de carga. 

    } catch (e) {
        console.log(e.message); //imprimo por consola
        res.status(413).send({ 'Error por Html: ': e.message }); //imprimo por html.
    }
});


//NO FUNCIONA!!
//eliminado de un registro mediante el titulo. DELETE + localhosto:3000/pelicula/titulo 
app.delete('/peliculas/:titulo', async(req, res) => {
    try {
        let query = 'DELETE FROM peliculas WHERE titulo = ?';

        const answer = await qy(query, req.body.titulo);

        console.log(answer);
        res.status(413).send('Se ha borrado la pelicula.');

    } catch (e) {
        console.log(e.message); //imprimo por consola
        res.status(413).send({ 'Error por Html: ': e.message }); //imprimo por html.
    }

});

//Funciona!
//Modificar el titulo segun el ID : put + localhost:3000/peliculas/id => json {"titulo" : "tituloNuevo"}
app.put('/peliculas/:id', async(req, res) => {

    try {

        const { id } = req.params;
        const tituloNuevo = req.body;


        let query = 'UPDATE peliculas SET ? WHERE id = ?';

        const answer = await qy(query, [tituloNuevo, id]);

        console.log(answer);
        res.status(413).send('Se ha actualizado el ID: ' + id);

    } catch (e) {
        console.log(e.message); //imprimo por consola
        res.status(413).send({ 'Error por Html: ': e.message }); //imprimo por html.
    }
});

//No funciona. no cambia el genero en Base de datos, pero no captura ningun error.
//Modificar el genero segun el Titulo : put + localhost:3000/peliculas/titulo => json {"genero" : "generoNuevo"}
app.put('/peliculas/:titulo', async(req, res) => {

    try {

        const { titulo } = req.params;
        const generoNuevo = req.body;


        let query = 'UPDATE peliculas SET ? WHERE titulo = ?';

        const answer = await qy(query, [generoNuevo, titulo]);

        console.log(answer);
        res.status(413).send('Se ha actualizado el genero de la pelicula: ' + titulo);

    } catch (e) {
        console.log(e.message); //imprimo por consola
        res.status(413).send({ 'Error por Html: ': e.message }); //imprimo por html.
    }
});


////////////////////////
// res.status(200).json(respuesta); 
///////////////////////




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