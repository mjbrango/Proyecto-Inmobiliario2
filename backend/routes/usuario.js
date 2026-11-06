
const express = require('express');
const router = express.Router();

const {
    crearUsuario,
    listarUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuarioController');

// CREATE
router.post('/', crearUsuario);

// READ
router.get('/', listarUsuarios);
router.get('/:id', obtenerUsuario);

// UPDATE
router.put('/:id', actualizarUsuario);

// DELETE
router.delete('/:id', eliminarUsuario);

module.exports = router;
