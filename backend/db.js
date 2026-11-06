const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '12345', 
    database: 'inmobiliaria',
    port: 3306
});

conexion.connect(err => {
    if (err) {
        console.error('Error conexión:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

module.exports = conexion;