const express = require('express');
const crearApiService = require('../services/apiService');
const crearApiController = require('../controllers/apiController');

const router = express.Router();

const apiService = crearApiService();
const apiController = crearApiController(apiService);

router.get('/usuarios', apiController.listarUsuarios);
router.get('/publicaciones', apiController.listarPublicaciones);

module.exports = router;