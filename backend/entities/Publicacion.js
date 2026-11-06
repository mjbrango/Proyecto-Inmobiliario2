
const { EntitySchema } = require('typeorm');

const Publicacion = new EntitySchema({
    name: 'Publicacion',
    tableName: 'publicaciones',

    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true
        },

        apiId: {
            type: 'int',
            unique: true
        },

        userId: {
            type: 'int'
        },

        titulo: {
            type: 'varchar',
            length: 255
        },

        contenido: {
            type: 'text'
        }
    }
});

module.exports = { Publicacion };
