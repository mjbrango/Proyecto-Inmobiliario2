const URL_BASE = 'https://jsonplaceholder.typicode.com';

function crearApiService(fetchImpl = fetch) {
    async function obtenerUsuarios() {
        const respuesta = await fetchImpl(`${URL_BASE}/users`);
        
        if (!respuesta.ok) {
            throw new Error('No se pudieron obtner los usuairos de la API externa');
        }

        return respuesta.json();
    }

    async function obtenerPublicaciones() {
        const respuesta = await fetchImpl(`${URL_BASE}/posts`);
        
        if (!respuesta.ok) {
            throw new Error('No se pudieron obtner las publicaciones de la API externa');
        }

        return respuesta.json();
    }

    return {
        obtenerUsuarios,
        obtenerPublicaciones
    };
}

module.exports = crearApiService;