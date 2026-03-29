const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Archivo de conexión que crearemos

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'ID_Admin' // Coincide con @Column(name = "ID_Admin")
    },
    nombre: {
        type: DataTypes.STRING(50),
        field: 'Nombre'
    },
    apellidoPaterno: {
        type: DataTypes.STRING(20),
        field: 'Apellido_Paterno'
    },
    apellidoMaterno: {
        type: DataTypes.STRING(20),
        field: 'Apellido_Materno'
    },
    correo: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true,
        field: 'Correo',
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(100),
        field: 'Password'
    }
}, {
    // Configuraciones adicionales
    tableName: 'admin', // Nombre de la tabla en la DB
    timestamps: false   // Si no tienes columnas 'createdAt' y 'updatedAt'
});

module.exports = Admin;