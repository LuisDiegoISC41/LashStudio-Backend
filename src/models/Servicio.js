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
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'Imagen'
    }
}, {
    tableName: 'servicio',
    timestamps: false
});

module.exports = Servicio;