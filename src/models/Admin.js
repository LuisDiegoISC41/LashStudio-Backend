const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'ID_Admin'
    },
    nombre: {
        type: DataTypes.STRING(50),
        field: 'Nombre'
    },
    apellidoPaterno: {
        type: DataTypes.STRING(50), // Subí a 50 por si hay apellidos largos
        field: 'Apellido_Paterno'
    },
    apellidoMaterno: {
        type: DataTypes.STRING(50), // Subí a 50
        field: 'Apellido_Materno'
    },
    correo: {
        type: DataTypes.STRING(100), // Subí a 100 por seguridad
        allowNull: false,
        unique: true,
        field: 'Correo',
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255), // <--- RECOMENDADO: 255 para el Hash de bcrypt
        field: 'Password'
    }
}, {
    tableName: 'admin',
    freezeTableName: true, // <--- OBLIGA a que Sequelize use 'admin' y no 'admins'
    timestamps: false
});

module.exports = Admin;