
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');

require('dotenv').config();

const app = express();
const { AppDataSource } = require('./config/database');

// ========================================
// 1. MIDDLEWARES
// ========================================

app.use(morgan(':method :url :status :response-time ms'));

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Configuración de sesiones
if (!process.env.SESSION_SECRET) {
    throw new Error('Falta configurar SESSION_SECRET en .env');
}

app.use(session({
    name: 'inmobiliaria.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60
    }
}));

app.use(express.static(path.join(__dirname, '..')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});

// ========================================
// 2. MIDDLEWARE DE AUTENTICACIÓN
// ========================================

const verificarSesion = (req, res, next) => {
    if (req.session && req.session.usuario) {
        return next();
    }

    return res.status(401).json({
        mensaje: 'Debes iniciar sesión para acceder a este recurso'
    });
};

// ========================================
// 3. ENDPOINT DE SALUD
// ========================================

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// ========================================
// 4. RUTAS PÚBLICAS
// ========================================

app.use('/login', require('./routes/login'));

// ========================================
// 5. RUTAS PROTEGIDAS
// ========================================

app.use('/tipopersona', verificarSesion, require('./routes/tipoPersona'));
app.use('/persona', verificarSesion, require('./routes/persona'));
app.use('/empleado', verificarSesion, require('./routes/empleado'));
app.use('/cliente', verificarSesion, require('./routes/cliente'));
app.use('/propietario', verificarSesion, require('./routes/propietario'));
app.use('/pais', verificarSesion, require('./routes/pais'));
app.use('/departamento', verificarSesion, require('./routes/departamento'));
app.use('/ciudad', verificarSesion, require('./routes/ciudad'));
app.use('/apartamento', verificarSesion, require('./routes/apartamento'));
app.use('/contrato', verificarSesion, require('./routes/contrato'));
app.use('/integracion', verificarSesion, require('./routes/integracion'));
app.use('/api', verificarSesion, require('./routes/api'));
app.use('/usuarios', verificarSesion, require('./routes/usuario'));

// ========================================
// 6. CERRAR SESIÓN
// ========================================

app.post('/logout', verificarSesion, (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('ERROR al cerrar sesión:', error);

            return res.status(500).json({
                mensaje: 'No se pudo cerrar la sesión'
            });
        }

        res.clearCookie('inmobiliaria.sid');

        return res.status(200).json({
            mensaje: 'Sesión cerrada correctamente'
        });
    });
});

// ========================================
// 7. RUTAS NO ENCONTRADAS
// ========================================

app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada'
    });
});

// ========================================
// 8. MANEJO DE ERRORES
// ========================================

app.use((err, req, res, next) => {
    console.error('========== ERROR DEL SISTEMA ==========');
    console.error(err.stack || err);
    console.error('=======================================');

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        error: 'Ha ocurrido un error interno en el servidor'
    });
});

// ========================================
// 9. INICIAR SERVIDOR
// ========================================

AppDataSource.initialize()
    .then(() => {
        console.log('Conectado a MySQL mediante TypeORM');

        app.listen(3000, () => {
            console.log('Servidor corriendo en puerto 3000');
        });
    })
    .catch(error => {
        console.error('Error al conectar con la base de datos:');
        console.error(error.stack || error);
    });
