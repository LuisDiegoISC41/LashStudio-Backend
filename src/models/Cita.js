const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cita = sequelize.define('Cita', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'ID_Cita'
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'Fecha'
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
        field: 'Hora'
    },
    idCliente: {
        type: DataTypes.UUID,
        field: 'ID_Cliente' // El nombre exacto en la tabla de Render
    },
    idServicio: {
        type: DataTypes.UUID,
        field: 'ID_Servicio' // El nombre exacto en la tabla de Render
    }
}, {
    tableName: 'cita',
    freezeTableName: true,
    timestamps: false
});

module.exports = Cita;