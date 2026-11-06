const { AppDataSource } = require('../config/database');
const { Usuario } = require('../entities/Usuario');
const { enviarUsuario } = require('../services/usuarioApiService');

async function enviarUsuarioExterno(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'ID de usuario no válido'
            });
        }

        const repositorio = AppDataSource.getRepository(Usuario);

        const usuario = await repositorio.findOneBy({ id });

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado en la base de datos'
            });
        }

        const respuestaAPI = await enviarUsuario(usuario);

        return res.status(200).json({
            mensaje: 'Usuario enviado correctamente a la API externa',
            usuarioLocal: usuario,
            respuestaAPI: respuestaAPI
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al enviar el usuario a la API externa',
            detalle: error.message
        });
    }
}

module.exports = { enviarUsuarioExterno };