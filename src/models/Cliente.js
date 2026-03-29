const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'ID_Cliente'
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'Nombre'
    },
    apellidoPaterno: {
        type: DataTypes.STRING(50),
        field: 'Apellido_Paterno'
    },
    apellidoMaterno: {
        type: DataTypes.STRING(50),
        field: 'Apellido_Materno'
    },
    telefono: {
        type: DataTypes.STRING(20), // Subí a 20 por si guardan ladas (+52)
        field: 'Telefono'
    },
    correo: {
        type: DataTypes.STRING(100), // <--- Subí de 50 a 100 para evitar errores
        allowNull: false,
        unique: true,
        field: 'Correo',
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255), // <--- 255 es el estándar de seguridad
        allowNull: false,
        field: 'Password'
    }
}, {
    tableName: 'cliente', 
    freezeTableName: true, // <--- Evita que Sequelize busque "clientes"
    timestamps: false    
});

module.exports = Cliente;