# Reto 1: API REST + pruebas

## Proyecto
Proyecto Inmobiliario 

## 1. API pública elegida 

se utilizó JSONPlaceholder, una API pública y gratuita que proporciona datos de prueba en formato JSON.

URL: https://jsonplaceholder.typicode.com/

se eligio porque permite obtener usuarios y publicaciones sin crear tablas adicionales en la base de datos del proyecto inmobiliario. Además, facilita las pruebas de los endpoints y el manejo de respuestas HTTP.


## 2. Tecnologías utilizadas

- JavaScript
- Node.js
- Express
- API REST
- JSONPlaceholder
- Módulo de pruebas nativo de node.js ('node:test')
- Aserciones con 'node:assert/strict'

## 3. Endpoints implementados 

## Obtener usuarios

- Método : GET
- Ruta: '/api/usuarios'
- URL local: http://localhost:3000/api/usuarios
- Respuesta esperada: arreglo JSON con los datos de los usuarios.

## Obtener publicaciones 

- Método: GET
- Ruta: '/api/publicaciones'
- URL local: http://localhost:3000/api/publicaciones 
- Respuesta esperada: arreglo JSON con las publicaciones.

## 4. Estructura del módulo

```text

backend/
├── controllers/
|   └── apiController.js
├── routes/
|   └── api.js
├── services/
|   └── apiService.js
├── tests/
|   └── api.test.js

```

## 5. Inyección de dependencias 

Se aplicó inyeccion de dependencias mediante las funciones 'crearApiService' y 'crearApiController'.

El controlador recibe el servicio como parámetro, en lugar de crear una instancia dentro de cada método. Esto permite sustituir el servicio real por uno simulado durante las pruebas unitarias, facilitando las pruebas sin depender de una conexión a internet.

## Manejo de errores 

El servicio comprueba si la respuesta HTTP fue sastifactoria. si la API externa devuelve una respuesta fallida, genera un error que es capturado por el controlador.

El controlador devuelve una respuesta JSON con el código HTTP 502 cuando ocurre un error al consultar el servicio externo.

## Cómo ejecutar el proyecto

Abrir una terminal dentro de la carpeta 'backend' y ejecutar:

'''bash
node server.js
'''
El servidor se ejecuta en el puerto 3000. 

Despues, abrir en el navegador:

- http://localhost:3000/api/usuarios
- http://localhost:3000/api/publicaciones

## 8. Cómo ejecutar las pruebas de usuario

Desde la carpeta 'backend', ejecutar:

'''bash
npm test
'''

Las pruebas verifican:

1. La estructura de los datos JSON obtenidos. 
2. El manejo de errores HTTP.
3. El funcionamiento del controlador con una dependencia simulada.

Resultaddo obtenido:

- Pruebas ejecutadas: 3
- Pruebas apriobadas: 3
- Pruebas fallidas: 0

## 9. Base datos 

Este modulo consume infromacion de una API pública y no requiere crear tablas nuevas en la base de datos del Proyecto inmobiliario.


# Reto 2: Persistencia Y CRUD

## 1. Descripción del proyecto

Este proyecto implementa una API REST utilizando Node.js y Express, conectada a una base de datos MySQL mediante TypeORM.

El sistema permite realizar operaciones CRUD sobre usuarios, almacenar información de manera persistente y comunicarse con una API externa utilizando axios.

## 2. Tecnologías utilizadas

- Node.js
- Express
- MySQL
- TypeORM
- Axios
- Postman
- Visual Studio Code
- JSONPlaceholder

## 3. Base de datos

Se utiliza una base de datos llamada reto2_persistencia. 

Las tablas usuarios y publicaciones son generadas automaticamente por TypeORM a partir de las entidades definidas en el proyecto.

No se crean manualmente las tablas mediantes instrucciones SQL

## 4. Operaciones CRUD

La API permite realizar las sisguientes operaciones sobre los usuarios:

| Metodo | Ruta | Descripción |
| :--- | :---: | ---: |
| POST | /usuarios | Crear un usuario|
| GET  | /usuarios | Consultar todos los usuarios |
| GET  | /usuarios/:id | Consultar un usuario por ID |
| PUT  | /usuarios/:id | Actualizar un usuario |
| DELETE | /usuarios/:id | Eliminar un usuario | 

## 5. Comunicación con API externa

El proyecto utiliza Axios para enviar información a JSONPlaceholder.

## Ruta de integración: 

POST /integracion/usuarios/:id/enviar

El funcionamiento es el siguiente:

1. Se consulta el usuario almacenado en MySQL.
2. TypeORM obtiene sus datos.
3. Axios envia la informacion a JSONPlaceholder.
4. LA API externa devuelve una respuesta.
5. El sistema muestra los datos locales y la respuesta externa

Nota: JSONPlaceholder es un servicio de pruebas que simula operaciones de creacion. No alamcena permanentemente los registros enviados.

## 6 Flujo de funcionamiento 

flowchart TD
    A[Cliente Postman] --> B[API REST con Express]
    B --> C[Controladores]
    C --> D[TypeORM]
    D --> E[(Base de datos MySQL)]
    C --> F[Axios]
    F --> G[API externa JSONPlaceholder]
    G --> H[Respuesta al cliente]

## 7. Configuracion del proyecto

## Requisitos

- Node.js instalado
- MySQL instalado y en funcionamiento
- Una base de datos llamada reto2_persistencia.

## Instalacion

1. Clonar el repositorio 
2. Abrir la carpeta backend
3. Instalar las dependencias:
   npm install
4. Crear el archivo .env dentro de backend:
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_CONTRASEÑA
DB_NAME=reto2_persistencia
PORT=3000
5. Inicia el servidor
   node server.js

El servidor esta disponible en:

http://localhost:3000

## 8. Pruebas

Las operaciones de la API se verifican mediante Postman.

Se realizan pruebas de creacion, consulta, actualizacion, eliminacion y envio de informacion a la API externa.

## 9. Conclusion

El desarrollo permitio implementar una API REST con persistencia de datos utilizando TypeORM y MySQL Tambien se realizaron las operaciones CRUD y la integracion con un servicio externo mediante Axios, aplicando conceptos de desarrollo backend y comunicacion entre aplicaciones 


# Reto 3: Aplicacion lista para el mundo real 

## 1. Observabilidad 

Se implemento un sistema basico de observabilidad para supervisar las solicitudes HTTP y facilitar la identificacion de errores durante la ejecucion de la aplicacion, 

## Registro de solicitudes con Morgan

Se integro Morgan para registrar automaticamente las solicitudes realizadas al servidor. 

Los registros muestran:

- Metodo HTTP utilizado.
- Ruta solicitada. 
- Codigo de respuesta HTTP.
- Tiempo de respuesta en milisegundos.

Ejemplo:

GET /health 200 26.230 ms
GET /usuarios 401 15.477 ms
GET /usuarios 200 161.684 ms

## Endpoint de salud

Se implementa el endpoint:

- Metodo: GET
- Ruta: /health
- URL local: http://localhost:3000/health

Este endpoint permite comprobar que el servidor esta funcionando y devuelve un estado y una marca de tiempo.

## 2. Manejo de errores

Se implementaron mecanismos para controlar los errores de la aplicacion:

- Middleware para rutas inexistentes, que devuelve el codigo HTTP 404.
- Middleware global de errores, que registra informacion tecnica en el servidor. 
- Respuestas JSON con mensajes generales para evitar exponer detalles internos al cliente.

## 3. Seguridad 

Se implemento autenticacion mediante sesiones utilizando express-session.

Las principales medidas son: 

- Validacion de credenciales durante el inicio de sesion
- Creacion de una sesion cuando el usuario se autentica correctamente.
- Proteccion de las rutas privadas mediante un middleware de verificacion de sesion.
- Respuesta HTTP 401 cuando se intenta acceder sin una sesion valida.
- Cierre de sesion mediante el endpoint Post /logout.
- Uso de una variable de entorno SESSION_SECRET para configurar la sesion

## 4. Validacion de datos

Se incorporaron validaciones en las operaciones CRUD de usuarios para comprobar los datos recibidos 

Se verifican campos obligatorios, tipo de datos, formato del correo electronico y valores validados para el identificador.

Cuando los datos no cumplen las condiciones establecidas, la API devuelve una respuesta HTTP 400.

## 5. Pruebas automatizadas 

Se utilizo el modulo nativo: test de Node.js para ejecutar las pruebas automatizadas.

Para ejecutar las pruebas desde la carpeta backend. utilizar:

npm test

Las pruebas verifican:

1. Que el servicio devuelva correctamente un arreglo de usuarios. 
2. Que el servicio maneje los errores HTTP de la API externa.
3. Que el controlador devuelva una respuesta JSON correcta utilizando una dependencia simulada.

Resultado de las pruebas 

- Pruebas ejecutadas: 3.
- Pruebas aprobadas: 3.
- Pruebas fallidas: 0.

## 6. Ejecucion del proyecto

Para iniciar el servidor:

npm start

El servidor se ejecuta en el puerto 3000.

Para comprobar su funcionamiento, acceder a:

- http://localhost:3000/health

Para ejecutar las pruebas automatizadas: 

npm test

## 7. Variables de entorno

El proyecto utiliza un archivo .env para configurar las conexiones y otros parametros de ejecucion.

Las variables necesarias incluyen:

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_CONTRASEÑA
DB_NAME=reto2_persistencia
DB_LOGIN_NAME=inmobiliaria
PORT=3000
SESSION_SECRET=TU_SECRETO_DE_SESION

Los valores reales de las contraseñas y secretos no deben publicarse en el repositorio.

## 8. Conclusion 

Con este reto se mejoro la preparacion para un entorno de ejecucion real mediante la incorporacion de observabilidad, registro de solicitudes, manejo centralizado de errores, autenticacion por sesiones y validaciones de datos.

Tambien se implementaron pruebas automatizadas para verificar el funcionamiento de los servicios y controladores, facilitando el mantenimiento y la deteccion de errores.


## Reto 3 - Pruebas de integracion reales (CREATE, READ, DELETE)

Las tres pruebas del archivo `backend/tests/integracion.test.js` validan **el flujo completo** mediante peticiones HTTP al servidor local con una sesion autenticada y comprobaciones directas en MySQL utilizando TypeORM:

1. **CREATE:** `POST /usuarios` retorna HTTP 201 y el registro existe en la base de datos.
2. **READ:** `GET /usuarios/:id` retorna HTTP 200 y exactamente los datos guardados.
3. **DELETE:** `DELETE /usuarios/:id` elimina el registro; `GET /usuarios/:id` devuelve HTTP 404 y el registro ya no existe en MySQL.

Las pruebas crean un usuario temporal con un identificador aleatorio y lo eliminan al finalizar, incluso si una comprobacion falla. No eliminan usuarios anteriores. Aun asi, se recomienda usar una base de datos de pruebas y **no interrumpir la ejecucion**, pues un cierre forzado puede impedir la limpieza.

### Ejecucion en Windows PowerShell (dos terminales)

Requisitos: Node.js 18 o superior, MySQL encendido, configuracion `backend/.env` correcta, y una cuenta valida de la aplicacion inmobiliaria.

**Terminal 1**, desde la carpeta `backend`:

```powershell
npm install
npm start
```

Esperar a que el servidor indique que se conecto a MySQL y escucha en el puerto 3000.

**Terminal 2**, tambien desde `backend`:

```powershell
# Solicita las credenciales sin escribir la contrasena en el historial de comandos.
$cred = Get-Credential -UserName "Maria" -Message "Credenciales del login local de Inmobiliaria"
$env:TEST_LOGIN_USUARIO = $cred.UserName
$env:TEST_LOGIN_CLAVE = $cred.GetNetworkCredential().Password

npm run test:integracion

# Borra la variable con la contrasena de esta terminal.
Remove-Item Env:TEST_LOGIN_CLAVE
```

Si se usa otra cuenta, cambiar `Maria` por el nombre de usuario correcto. Para guardar el resultado como evidencia, tomar una **captura de las tres pruebas completadas correctamente**; no incluir contrasenas en las capturas.

Las pruebas unitarias anteriores del Reto 1 siguen disponibles de forma independiente:

```powershell
npm test
```

> Si la prueba de integracion falla al iniciar, verificar que el servidor local esta encendido, las credenciales son correctas y `DB_NAME` en `.env` apunta a la misma base de datos MySQL que usa la aplicacion. La prueba de integracion no publica el proyecto en internet.
