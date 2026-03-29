const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Servicio = sequelize.define('Servicio', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'ID_Servicio'
    },
    nombre: {
        type: DataTypes.STRING(50),
        field: 'Nombre'
    },
    descripcion: {
        type: DataTypes.STRING(150),
        field: 'Descripcion'
    },
    precio: {
        type: DataTypes.INTEGER,
        field: 'Precio'
    }
}, {
    tableName: 'SERVICIO',
    timestamps: false
});

module.exports = Servicio;