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
    // Definimos las columnas de unión exactamente como están en la DB
    idCliente: {
        type: DataTypes.UUID,
        field: 'ID_Cliente',
        references: { model: 'cliente', key: 'ID_Cliente' }
    },
    idServicio: {
        type: DataTypes.UUID,
        field: 'ID_Servicio',
        references: { model: 'servicio', key: 'ID_Servicio' }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'confirmada',
        field: 'Status'
    },
    motivo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'Motivo'
    }
}, {
    tableName: 'cita', // <--- Asegúrate que en Render la tabla sea 'cita' (singular)
    freezeTableName: true,
    timestamps: false,
    underscored: false
});

module.exports = Cita;