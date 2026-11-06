const express = require('express');
const router = express.Router();

const {
    enviarUsuarioExterno
} = require('../controllers/integracionController');

router.post('/usuarios/:id/enviar', enviarUsuarioExterno);

module.exports = router;