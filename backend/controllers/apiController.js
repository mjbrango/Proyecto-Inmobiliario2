
function crearApiController(apiService) {

    async function listarUsuarios(req, res) {
        try {
            const usuarios = await apiService.obtenerUsuarios();

            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(502).json({
                error: 'Error al consultar los usuarios',
                detalle: error.message
            });
        }
    }

    async function listarPublicaciones(req, res) {
        try {
            const publicaciones = await apiService.obtenerPublicaciones();

            return res.status(200).json(publicaciones);
        } catch (error) {
            return res.status(502).json({
                error: 'Error al consultar las publicaciones',
                detalle: error.message
            });
        }
    }

    return {
        listarUsuarios,
        listarPublicaciones
    };
}

module.exports = crearApiController;
