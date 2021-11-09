const express = require('express')
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

// console.log( process.env );

// Crear servidor/ aplicacion de express
const app = express();

// Base de Datos
dbConnection();

// Directorio Public
app.use( express.static('public') )

// CORS
app.use( cors() );

// lectura y parseo del Body
app.use( express.json() );

// Rutas
app.use( '/api/auth', require('./routes/auth'));



app.listen( process.env.PORT , () => {
    console.log(`Server running on port ${process.env.PORT}`);
});


