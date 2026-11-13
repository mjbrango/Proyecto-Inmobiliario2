require('dotenv').config();

const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_LOGIN_NAME,
    port: Number(process.env.DB_PORT || 3306)
});

conexion.connect((err) => {
    if (err) {
        console.error('Error al conectar con MySQL:', err.message);
    } else {
        console.log('Conectado a MySQL (base de datos de login)');
    }
});

module.exports = conexion;
