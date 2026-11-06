
const { AppDataSource } = require('../config/database');
const { Usuario } = require('../entities/Usuario');

// Obtener el repositorio
const usuarioRepository = () =>
    AppDataSource.getRepository(Usuario);

// CREATE: Registrar usuario
const crearUsuario = async (req, res) => {
    try {
        const { apiId, nombre, username, email } = req.body;

        if (!apiId || !nombre || !username || !email) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const existente = await usuarioRepository().findOneBy({ apiId });

        if (existente) {
            return res.status(409).json({
                mensaje: 'El usuario ya existe'
            });
        }

        const usuario = usuarioRepository().create({
            apiId,
            nombre,
            username,
            email
        });

        const usuarioGuardado = await usuarioRepository().save(usuario);

        return res.status(201).json({
            mensaje: 'Usuario creado correctamente',
            usuario: usuarioGuardado
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al crear usuario',
            detalle: error.message
        });
    }
};

// READ: Consultar todos los usuarios
const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioRepository().find();

        return res.status(200).json(usuarios);

    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al consultar usuarios',
            detalle: error.message
        });
    }
};

// READ: Consultar usuario por ID
const obtenerUsuario = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID no es válido'
            });
        }

        const usuario = await usuarioRepository().findOneBy({ id });

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        return res.status(200).json(usuario);

    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al consultar usuario',
            detalle: error.message
        });
    }
};

// UPDATE: Actualizar usuario
const actualizarUsuario = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID no es válido'
            });
        }

        const { nombre, username, email } = req.body;

        if (!nombre || !username || !email) {
            return res.status(400).json({
                mensaje: 'Nombre, username y email son obligatorios'
            });
        }

        const usuario = await usuarioRepository().findOneBy({ id });

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        usuario.nombre = nombre;
        usuario.username = username;
        usuario.email = email;

        const actualizado = await usuarioRepository().save(usuario);

        return res.status(200).json({
            mensaje: 'Usuario actualizado correctamente',
            usuario: actualizado
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al actualizar usuario',
            detalle: error.message
        });
    }
};

// DELETE: Eliminar usuario
const eliminarUsuario = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID no es válido'
            });
        }

        const usuario = await usuarioRepository().findOneBy({ id });

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        await usuarioRepository().remove(usuario);

        return res.status(200).json({
            mensaje: 'Usuario eliminado correctamente'
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al eliminar usuario',
            detalle: error.message
        });
    }
};

module.exports = {
    crearUsuario,
    listarUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario
};
