
const express = require('express');
const router = express.Router();
const conexion = require('../db');

router.post('/', (req, res) => {
    const { usuario, clave } = req.body;

    if (
        typeof usuario !== 'string' ||
        !usuario.trim() ||
        typeof clave !== 'string' ||
        !clave
    ) {
        return res.status(400).json({
            mensaje: 'Debes ingresar usuario y contraseña'
        });
    }

    const sql = `
        SELECT nombreUsuario
        FROM usuario
        WHERE nombreUsuario = ? AND clave = ?
        LIMIT 1
    `;

    conexion.query(sql, [usuario.trim(), clave], (err, result) => {
        if (err) {
            console.error('ERROR en inicio de sesión:', err.stack || err);

            return res.status(500).json({
                mensaje: 'Ocurrió un error interno al iniciar sesión'
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                mensaje: 'Usuario o contraseña incorrectos'
            });
        }

        req.session.regenerate((error) => {
            if (error) {
                console.error('ERROR al crear sesión:', error);

                return res.status(500).json({
                    mensaje: 'No se pudo iniciar la sesión'
                });
            }

            req.session.usuario = {
                nombreUsuario: result[0].nombreUsuario
            };

            return res.status(200).json({
                mensaje: 'Login correcto',
                usuario: req.session.usuario
            });
        });
    });
});

module.exports = router;

