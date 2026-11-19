# Informe de Hardening - Reto 3
## Proyecto Inmobiliario | Lenguaje de Programacion III

**Objetivo:** identificar tres vulnerabilidades verificables en el codigo original del Reto 2, explicar sus riesgos y documentar las medidas implementadas para el Reto 3.

**Alcance:** backend Node.js, Express y TypeORM ejecutado localmente en `http://localhost:3000`. No se requiere publicar la aplicacion en internet.

**Referencias de Git verificadas:**
- **Antes (Reto 2):** [commit `f20d080`](https://github.com/mjbrango/Proyecto-Inmobiliario2/commit/f20d08061dd79d020b6be856879c09145583a976)
- **Despues (Reto 3):** [commit `5e14d18`](https://github.com/mjbrango/Proyecto-Inmobiliario2/commit/5e14d1857b5995e195ad2f3884bc521575cc974a)

Los fragmentos de esta comparacion corresponden a esos commits del repositorio. Las capturas del **antes** se pueden realizar en GitHub abriendo el enlace del archivo antiguo, sin reemplazar el codigo actual.

---

## Vulnerabilidad 1 - Endpoints sin autenticacion
**Riesgo: medio/alto.** La API de usuarios permitia leer, crear, modificar y eliminar registros sin comprobar la identidad del solicitante.

**ANTES: `backend/server.js` (Reto 2)**

```js
app.use('/usuarios', require('./routes/usuario'));
```

Las rutas se montaban directamente sin un control previo de sesion.

**DESPUES: `backend/server.js` (Reto 3)**

```js
const verificarSesion = (req, res, next) => {
    if (req.session && req.session.usuario) {
        return next();
    }
    return res.status(401).json({
        mensaje: 'Debes iniciar sesion para acceder a este recurso'
    });
};

app.use('/usuarios', verificarSesion, require('./routes/usuario'));
```

Se incorporo `express-session` y una verificacion de sesion antes de los endpoints privados. La respuesta sin sesion es HTTP 401. La aplicacion tambien dispone de `POST /logout`.

**Evidencia funcional existente:** [consulta de /usuarios sin autenticacion (401)](Evidencia_Reto2/evidencia_seguridad_sin_autenticacion.png.png), [consulta con sesion activa](Evidencia_Reto2/evidencia_seguridad_con_autenticacion.png.png) y [cierre de sesion y nuevo 401](Evidencia_Reto2/seguridad_cierre_sesion.png.png).

**Capturas ANTES/DESPUES por completar:**
- [ANTES - codigo server.js](https://github.com/mjbrango/Proyecto-Inmobiliario2/blob/f20d08061dd79d020b6be856879c09145583a976/backend/server.js)
- [DESPUES - codigo server.js](https://github.com/mjbrango/Proyecto-Inmobiliario2/blob/5e14d1857b5995e195ad2f3884bc521575cc974a/backend/server.js)
- Tomar capturas legibles resaltando el `app.use('/usuarios', ...)` y el middleware `verificarSesion`. En las capturas funcionales ocultar cualquier contrasena visible.

---

## Vulnerabilidad 2 - Validacion insuficiente de entradas
**Riesgo: alto.** El CRUD originalmente solo comprobaba que algunos campos no fueran vacios, sin validar rigurosamente tipo, longitudes, formato de correo o valores numericos.

**ANTES: `backend/controllers/usuarioController.js` (Reto 2)**

```js
const { apiId, nombre, username, email } = req.body;

if (!apiId || !nombre || !username || !email) {
    return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios'
    });
}
```

Por ejemplo, un correo sin `@` o un `apiId` inadecuado no se rechazaba por formato en esa validacion.

**DESPUES: `backend/controllers/usuarioController.js` (Reto 3)**

```js
const idApi = Number(apiId);
if (!Number.isInteger(idApi) || idApi <= 0) {
    return { error: 'El apiId debe ser un numero entero positivo' };
}

const emailLimpio = email.trim();
const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!formatoEmail.test(emailLimpio)) {
    return { error: 'El formato del correo electronico no es valido' };
}
```

El controlador actual llama a `validarDatosUsuario`, verifica tipos, campos obligatorios, longitud maxima de `nombre` (150), `username` (100) y `email` (150), formato de correo, y `apiId` entero positivo al crear. Cuando la entrada es invalida responde HTTP 400. El fragmento de arriba es un extracto ilustrativo de la funcion completa.

**Capturas ANTES/DESPUES por completar:**
- [ANTES - codigo usuarioController.js](https://github.com/mjbrango/Proyecto-Inmobiliario2/blob/f20d08061dd79d020b6be856879c09145583a976/backend/controllers/usuarioController.js)
- [DESPUES - codigo usuarioController.js](https://github.com/mjbrango/Proyecto-Inmobiliario2/blob/5e14d1857b5995e195ad2f3884bc521575cc974a/backend/controllers/usuarioController.js)
- Opcional: en Postman enviar con sesion autenticada un `POST /usuarios` con `email` invalido y capturar HTTP 400 (sin incluir contrasenas).

---

## Vulnerabilidad 3 - Configuracion CORS demasiado permisiva
**Riesgo: medio.** En el Reto 2, CORS no tenia una lista de origenes permitidos. Esto permitia que navegadores de cualquier origen leyeran respuestas de la API si otras condiciones de acceso lo permitian.

**ANTES: `backend/server.js` (Reto 2)**

```js
app.use(cors());
```

**DESPUES: `backend/server.js` (Reto 3)**

```js
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
```

Se configuro una lista restringida a `http://localhost:3000` para el entorno local, en lugar de permitir todos los origenes. **CORS no reemplaza la autenticacion:** restringe la lectura desde navegadores de otros origenes, no las solicitudes directas con PowerShell/Postman.

**Capturas ANTES/DESPUES por completar:**
- [ANTES - codigo server.js](https://github.com/mjbrango/Proyecto-Inmobiliario2/blob/f20d08061dd79d020b6be856879c09145583a976/backend/server.js)
- [DESPUES - codigo server.js](https://github.com/mjbrango/Proyecto-Inmobiliario2/blob/5e14d1857b5995e195ad2f3884bc521575cc974a/backend/server.js)
- Opcional: mostrar en la pestaña Network del navegador la cabecera `Access-Control-Allow-Origin` para un origen permitido.

---

## Otras mejoras observadas (no cuentan como las tres anteriores)

- En el controlador de usuarios se elimino la devolucion de `error.message` al cliente y se conservan detalles tecnicos en los registros del servidor.
- En el login se paso de `SELECT *` y devolver la fila completa a seleccionar unicamente `nombreUsuario` para la respuesta; se regenera la sesion tras autenticar.
- El archivo `backend/db.js` paso de credenciales escritas en el codigo a `process.env.DB_USER`, `process.env.DB_PASSWORD` y otras variables de entorno, y `.gitignore` ignora `.env`.

**Riesgo pendiente:** la version antigua del repositorio incluia una contrasena de MySQL directamente en `backend/db.js`, visible en el historial de Git. Si esa contrasena sigue vigente, debe cambiarse en MySQL y actualizarse en el `.env` local. La migracion a variables de entorno no elimina un secreto del historial publico. Tampoco debe publicarse la contrasena del login en capturas.

**Limitacion:** el inicio de sesion actual compara `clave` directamente en la consulta SQL. La migracion a contrasenas almacenadas como hash es una mejora pendiente; no se afirma que este problema ya este corregido.

---

## Verificacion y evidencias del Reto 3

1. **Autenticacion:** se ha observado `GET /usuarios` con sesion activa y respuesta HTTP 200, acceso sin sesion con HTTP 401 y respuesta HTTP 401 despues de cerrar sesion. Ver enlaces de evidencia de la vulnerabilidad 1.
2. **Endpoint de salud:** el proyecto implementa `GET /health` con `status: 'ok'` y marca de tiempo. Guardar captura de PowerShell o Postman.
3. **Logging:** `morgan(':method :url :status :response-time ms')` registra metodo, ruta, estado y tiempo. Guardar captura de la consola del servidor con peticiones reales.
4. **Pruebas unitarias del Reto 1:** `npm test` -> el estudiante verifico 3 pruebas aprobadas y 0 fallidas.
5. **Pruebas de integracion del Reto 3:** `npm run test:integracion` -> el estudiante verifico 3 pruebas aprobadas y 0 fallidas, con servidor y MySQL local.

Las **capturas del codigo ANTES y DESPUES de cada vulnerabilidad** son obligatorias segun la guia del Reto 3. Tener los commits y los enlaces no sustituye esas seis capturas; hay que tomarlas e incorporarlas al informe final.

## Checklist para completar la entrega

- [ ] Captura ANTES y DESPUES de vulnerabilidad 1
- [ ] Captura ANTES y DESPUES de vulnerabilidad 2
- [ ] Captura ANTES y DESPUES de vulnerabilidad 3
- [x] Evidencias funcionales de proteccion de rutas (401, sesion valida y logout)
- [x] Pruebas unitarias: 3/3 comprobadas en el equipo
- [x] Pruebas de integracion: 3/3 comprobadas en el equipo
- [ ] Captura de `/health`, logs de Morgan y resultados de ambas suites
- [ ] Video final de maximo 10 minutos (Retos 1, 2 y 3)
