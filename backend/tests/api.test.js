
const test = require('node:test');
const assert = require('node:assert/strict');

const crearApiService = require('../services/apiService');
const crearApiController = require('../controllers/apiController');

test('Prueba 1: obtener usuarios devuelve un arreglo con id y name', async () => {
    const usuariosSimulados = [
        { id: 1, name: 'Usuario de prueba', email: 'prueba@correo.com' }
    ];

    const fetchSimulado = async () => ({
        ok: true,
        json: async () => usuariosSimulados
    });

    const apiService = crearApiService(fetchSimulado);
    const resultado = await apiService.obtenerUsuarios();

    assert.ok(Array.isArray(resultado));
    assert.equal(resultado[0].id, 1);
    assert.equal(resultado[0].name, 'Usuario de prueba');
});

test('Prueba 2: obtener publicaciones maneja errores HTTP', async () => {
    const fetchSimulado = async () => ({
        ok: false,
        status: 500,
        json: async () => ({})
    });

    const apiService = crearApiService(fetchSimulado);

    await assert.rejects(
        apiService.obtenerPublicaciones(),
        /No se pudieron/
    );
});

test('Prueba 3: el controlador devuelve JSON usando un mock', async () => {
    const usuariosSimulados = [
        { id: 1, name: 'Usuario simulado' }
    ];

    const servicioMock = {
        obtenerUsuarios: async () => usuariosSimulados,
        obtenerPublicaciones: async () => []
    };

    const apiController = crearApiController(servicioMock);

    let codigoEstado;
    let respuestaJSON;

    const req = {};

    const res = {
        status(codigo) {
            codigoEstado = codigo;
            return this;
        },
        json(datos) {
            respuestaJSON = datos;
            return this;
        }
    };

    await apiController.listarUsuarios(req, res);

    assert.equal(codigoEstado, 200);
    assert.deepEqual(respuestaJSON, usuariosSimulados);
});
