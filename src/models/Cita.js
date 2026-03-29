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
    // ✅ DEFINICIÓN EXPLÍCITA DE LLAVES FORÁNEAS
    idCliente: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'ID_Cliente'
    },
    idServicio: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'ID_Servicio'
    }
}, {
    tableName: 'cita',
    freezeTableName: true,
    timestamps: false
});

module.exports = Cita;