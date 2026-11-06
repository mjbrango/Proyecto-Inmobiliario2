
const { EntitySchema } = require('typeorm');

const Usuario = new EntitySchema({
    name: 'Usuario',
    tableName: 'usuarios',

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

        nombre: {
            type: 'varchar',
            length: 150
        },

        username: {
            type: 'varchar',
            length: 100
        },

        email: {
            type: 'varchar',
            length: 150
        }
    }
});

module.exports = { Usuario };
