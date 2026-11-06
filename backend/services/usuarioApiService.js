const axios = require('axios');

const URL_API = 'https://jsonplaceholder.typicode.com/users';

async function enviarUsuario(usuario) {
    const respuesta = await axios.post(URL_API, {
        name: usuario.nombre,
        username: usuario.username,
        email: usuario.email
    });

    return respuesta.data;
}

module.exports = { enviarUsuario };