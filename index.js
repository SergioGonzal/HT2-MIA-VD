var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

var DB = require('./config/oracleConnection');

app.listen(port, function(){
    console.log('Listening on port ', port)
});

app.get('/', function(req, res) {
    res.send('Sergio Lenin González Solis - 201503798')
});

app.post('/registro', async function(req, res) {
    try{
        const nombre = req.body.nombre;
        const email = req.body.email;
        const pass = req.body.password;

        let sql = 'INSERT INTO usuario(nombre, email, contraseña) VALUES (\'' + nombre + '\', \'' + email + '\', \'' + pass +'\')';
        await DB.Open(sql, [], true);

        res.send('Usuario agregado con éxito!')
        //res.send(sql);
    } catch (err) {
        res.send('Error al crear el usuario!')
        console.log('Error al crear el usuario! ', err)
    }
});

app.post('/login', async function(req, res) {
    try{
        const email = req.body.email;
        const pass = req.body.password;

        let sql = 'SELECT contraseña FROM usuario WHERE email=\'' + email + '\'';
        let result = await DB.Open(sql, [], false);
        let auth = [];

        auth = result.rows.map(user =>{

            if (user[0] == pass) {
                let authSchema = {
                    "auth" : true
                }
                return(authSchema);
            }else {
                let authSchema = {
                    "auth" : false
                }
                return(authSchema);
            }
        })

        res.json(auth)
    } catch (err) {
        res.send('Error !')
        console.log('Error ! ', err)
    }
});

app.get('/getUsuarios', async function(req, res) {
    try {
        let query = "SELECT * FROM usuario";
        let result = await DB.Open(query, [], false);
        let usuarios = [];

        usuarios = result.rows.map(user =>{
            let usuariosSchema = {
                "Nombre" : user[1],
                "Correo":  user[0],
                "Contraseña" : user[2]
            }

            return(usuariosSchema);
        })
        res.json(usuarios);
    } catch (err) {
        res.send('Error al hacer la petición!');
        console.error('Error al hacer la petición! ', err);
    }
});