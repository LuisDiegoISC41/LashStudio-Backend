const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'ID_Cliente' // Coincide con @Column(name = "ID_Cliente")
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
        type: DataTypes.STRING(10),
        field: 'Telefono'
    },
    correo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'Correo',
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'Password'
    }
}, {
    tableName: 'cliente', // Coincide con @Table(name = "Cliente")
    timestamps: false    // En Java no tenías createdAt/updatedAt
});

module.exports = Cliente;