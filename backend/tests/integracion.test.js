// Reto 3: tres pruebas de integracion reales (HTTP + sesiones + TypeORM + MySQL).
// Requiere el servidor local encendido y las credenciales TEST_LOGIN_USUARIO / TEST_LOGIN_CLAVE.
// Crea exclusivamente un usuario temporal y lo elimina al terminar.
const test = require('node:test');
const { before, after } = require('node:test');
const assert = require('node:assert/strict');
const { randomInt, randomUUID } = require('node:crypto');
const { AppDataSource } = require('../config/database');
const { Usuario } = require('../entities/Usuario');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const URL_TEST = new URL(BASE_URL);
if (!['localhost', '127.0.0.1'].includes(URL_TEST.hostname)) {
    throw new Error('Estas pruebas solo se pueden ejecutar contra un servidor local.');
}

const etiqueta = randomUUID().replace(/-/g, '').slice(0, 12);
const datosPrueba = {
    apiId: randomInt(1_000_000_000, 2_000_000_000),
    nombre: 'Usuario temporal de integracion',
    username: 'prueba_integracion_' + etiqueta,
    email: 'integracion_' + etiqueta + '@example.com'
};

let cookieSesion;
let repositorio;
let idCreado;

async function solicitar(ruta, opciones = {}) {
    const respuesta = await fetch(new URL(ruta, URL_TEST), {
        ...opciones,
        headers: {
            ...(cookieSesion ? { Cookie: cookieSesion } : {}),
            ...(opciones.headers || {})
        },
        signal: AbortSignal.timeout(10000)
    });
    const cuerpo = await respuesta.json().catch(() => null);
    return { codigo: respuesta.status, cuerpo, cabeceras: respuesta.headers };
}

before(async () => {
    const usuario = process.env.TEST_LOGIN_USUARIO;
    const clave = process.env.TEST_LOGIN_CLAVE;
    if (!usuario || !clave) {
        throw new Error('Configura TEST_LOGIN_USUARIO y TEST_LOGIN_CLAVE antes de ejecutar npm run test:integracion.');
    }

    let salud;
    try {
        salud = await solicitar('/health');
    } catch (error) {
        throw new Error('No se pudo conectar a localhost:3000. Ejecuta npm start en otra terminal.', { cause: error });
    }
    assert.equal(salud.codigo, 200, 'El servidor no respondio correctamente en /health');

    const login = await solicitar('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, clave })
    });
    assert.equal(login.codigo, 200, 'No se pudo iniciar sesion: ' + JSON.stringify(login.cuerpo));

    const cookieCompleta = login.cabeceras.get('set-cookie');
    assert.ok(cookieCompleta, 'El login no devolvio la cookie de sesion');
    cookieSesion = cookieCompleta.split(';')[0];

    // Consulta directamente la BD real que usa TypeORM, no un mock.
    await AppDataSource.initialize();
    repositorio = AppDataSource.getRepository(Usuario);

    // Garantiza que el identificador elegido no corresponde a un registro existente.
    for (let intento = 0; intento < 10; intento++) {
        const existente = await repositorio.findOneBy({ apiId: datosPrueba.apiId });
        if (!existente) break;
        datosPrueba.apiId = randomInt(1_000_000_000, 2_000_000_000);
        if (intento === 9) throw new Error('No se logro generar un apiId libre para la prueba');
    }
});

test('Integracion 1 - CREATE: POST /usuarios responde 201 y guarda en MySQL', async () => {
    const respuesta = await solicitar('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosPrueba)
    });

    assert.equal(respuesta.codigo, 201, JSON.stringify(respuesta.cuerpo));
    idCreado = respuesta.cuerpo?.usuario?.id;
    assert.ok(Number.isInteger(idCreado) && idCreado > 0, 'El POST debe devolver el ID creado');

    const enBD = await repositorio.findOneBy({ id: idCreado });
    assert.ok(enBD, 'El usuario no se encontro en MySQL');
    assert.equal(enBD.apiId, datosPrueba.apiId);
    assert.equal(enBD.email, datosPrueba.email);
});

test('Integracion 2 - READ: GET /usuarios/:id devuelve el registro guardado', async () => {
    assert.ok(idCreado, 'CREATE debe ejecutarse correctamente antes de READ');
    const respuesta = await solicitar('/usuarios/' + idCreado);

    assert.equal(respuesta.codigo, 200, JSON.stringify(respuesta.cuerpo));
    assert.equal(respuesta.cuerpo.id, idCreado);
    assert.equal(respuesta.cuerpo.apiId, datosPrueba.apiId);
    assert.equal(respuesta.cuerpo.nombre, datosPrueba.nombre);
    assert.equal(respuesta.cuerpo.username, datosPrueba.username);
    assert.equal(respuesta.cuerpo.email, datosPrueba.email);
});

test('Integracion 3 - DELETE: eliminar y verificar GET 404', async () => {
    assert.ok(idCreado, 'CREATE debe ejecutarse correctamente antes de DELETE');

    const eliminacion = await solicitar('/usuarios/' + idCreado, { method: 'DELETE' });
    assert.equal(eliminacion.codigo, 200, JSON.stringify(eliminacion.cuerpo));

    const consulta = await solicitar('/usuarios/' + idCreado);
    assert.equal(consulta.codigo, 404, JSON.stringify(consulta.cuerpo));

    const enBD = await repositorio.findOneBy({ id: idCreado });
    assert.equal(enBD, null, 'El usuario sigue en la base de datos');
});

after(async () => {
    try {
        // Limpieza incluso si falla alguna de las tres pruebas.
        // Nunca elimina usuarios preexistentes: exige coincidencia con el usuario temporal.
        if (repositorio) {
            const temporal = await repositorio.findOneBy({ apiId: datosPrueba.apiId });
            if (temporal &&
                temporal.username === datosPrueba.username &&
                temporal.email === datosPrueba.email) {
                await repositorio.remove(temporal);
            }
        }
    } finally {
        try {
            if (cookieSesion) {
                await solicitar('/logout', { method: 'POST' });
            }
        } finally {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
        }
    }
});
