
const { AppDataSource } = require('../config/database');
const { Usuario } = require('../entities/Usuario');

const usuarioRepository = () =>
    AppDataSource.getRepository(Usuario);

// Registrar errores únicamente en el servidor
const registrarError = (operacion, error) => {
    console.error(`ERROR en ${operacion}:`, error.stack || error);
};

// Validar y limpiar los datos recibidos
const validarDatosUsuario = (datos, incluirApiId = false) => {
    const { apiId, nombre, username, email } = datos;

    if (incluirApiId) {
        const idApi = Number(apiId);

        if (
            apiId === undefined ||
            apiId === null ||
            apiId === '' ||
            !Number.isInteger(idApi) ||
            idApi <= 0
        ) {
            return { error: 'El apiId debe ser un número entero positivo' };
        }
    }

    if (
        typeof nombre !== 'string' ||
        typeof username !== 'string' ||
        typeof email !== 'string'
    ) {
        return { error: 'Los campos deben contener texto válido' };
    }

    const nombreLimpio = nombre.trim();
    const usernameLimpio = username.trim();
    const emailLimpio = email.trim();

    if (!nombreLimpio || !usernameLimpio || !emailLimpio) {
        return { error: 'Nombre, username y email son obligatorios' };
    }

    if (nombreLimpio.length > 150) {
        return { error: 'El nombre no puede superar 150 caracteres' };
    }

    if (usernameLimpio.length > 100) {
        return { error: 'El username no puede superar 100 caracteres' };
    }

    if (emailLimpio.length > 150) {
        return { error: 'El email no puede superar 150 caracteres' };
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(emailLimpio)) {
        return { error: 'El formato del correo electrónico no es válido' };
    }

    return {
        datos: {
            ...(incluirApiId ? { apiId: Number(apiId) } : {}),
            nombre: nombreLimpio,
            username: usernameLimpio,
            email: emailLimpio
        }
    };
};

// CREATE: Registrar usuario
const crearUsuario = async (req, res) => {
    try {
        const validacion = validarDatosUsuario(req.body, true);

        if (validacion.error) {
            return res.status(400).json({
                mensaje: validacion.error
            });
        }

        const { apiId, nombre, username, email } = validacion.datos;

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
        registrarError('crear usuario', error);

        return res.status(500).json({
            mensaje: 'Ocurrió un error interno al crear el usuario'
        });
    }
};

// READ: Consultar todos los usuarios
const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioRepository().find();

        return res.status(200).json(usuarios);

    } catch (error) {
        registrarError('listar usuarios', error);

        return res.status(500).json({
            mensaje: 'Ocurrió un error interno al consultar los usuarios'
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
        registrarError('obtener usuario', error);

        return res.status(500).json({
            mensaje: 'Ocurrió un error interno al consultar el usuario'
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

        const validacion = validarDatosUsuario(req.body);

        if (validacion.error) {
            return res.status(400).json({
                mensaje: validacion.error
            });
        }

        const usuario = await usuarioRepository().findOneBy({ id });

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        Object.assign(usuario, validacion.datos);

        const actualizado = await usuarioRepository().save(usuario);

        return res.status(200).json({
            mensaje: 'Usuario actualizado correctamente',
            usuario: actualizado
        });

    } catch (error) {
        registrarError('actualizar usuario', error);

        return res.status(500).json({
            mensaje: 'Ocurrió un error interno al actualizar el usuario'
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
        registrarError('eliminar usuario', error);

        return res.status(500).json({
            mensaje: 'Ocurrió un error interno al eliminar el usuario'
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
