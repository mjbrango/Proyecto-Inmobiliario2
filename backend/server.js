const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); 
// rutas
app.use('/login', require('./routes/login'));
app.use('/tipopersona', require('./routes/tipoPersona'));
app.use('/persona', require('./routes/persona'));
app.use('/empleado', require('./routes/empleado'));
app.use('/cliente', require('./routes/cliente'));
app.use('/propietario', require('./routes/propietario'));
app.use('/pais', require('./routes/pais'));
app.use('/departamento', require('./routes/departamento'));
app.use('/ciudad', require('./routes/ciudad'));
app.use('/apartamento', require('./routes/apartamento'));
app.use('/contrato', require('./routes/contrato'));
app.use('/integracion', require('./routes/integracion'));
app.use('/api', require('./routes/api'));

// Rutas CRUD de usuarios con TypeORM
app.use('/usuarios', require('./routes/usuario'));

//app.listen(3000, () => {
  //console.log('Servidor corriendo en puerto 3000');
//});

const { AppDataSource } = require('./config/database');

AppDataSource.initialize()
    .then(() => {
        console.log('Conectado a MySQL mediante TypeORM');

        app.listen(3000, () => {
            console.log('Servidor corriendo en puerto 3000');
        });
    })
    .catch(error => {
        console.error('Error al conectar con la base de datos:', error);
    });