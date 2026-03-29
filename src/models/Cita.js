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
        type: DataTypes.DATEONLY, // DATEONLY equivale a LocalDate (solo fecha)
        field: 'Fecha'
    },
    hora: {
        type: DataTypes.TIME, // TIME equivale a LocalTime (solo hora)
        field: 'Hora'
    },
    // Las llaves foráneas se pueden declarar aquí o dejar que Sequelize las maneje
    idCliente: {
        type: DataTypes.UUID,
        field: 'ID_Cliente'
    },
    idServicio: {
        type: DataTypes.UUID,
        field: 'ID_Servicio'
    }
}, {
    tableName: 'cita',
    timestamps: false
});

module.exports = Cita;