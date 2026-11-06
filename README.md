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
node --test tests/api.test.js
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
- Una base de datos llamada reto2_persistenca.

## Instalacion

1. Clonar el repositorio 
2. Abrir la carpeta backend
3. Instalar las dependencias:
   npm install
4. Crear el archivo .env dentro de backend:
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USR=root
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
