const sequelize = require('../config/database');
const Admin = require('./Admin');
const Cliente = require('./Cliente');
const Servicio = require('./Servicio');
const Cita = require('./Cita');


Cita.belongsTo(Cliente, { 
    foreignKey: 'idCliente', // Esto buscará la columna mapeada a 'ID_Cliente'
    as: 'cliente'            // Alias para: include: [{ model: Cliente, as: 'cliente' }]
});

// Un Cliente puede tener muchas Citas
Cliente.hasMany(Cita, { 
    foreignKey: 'idCliente', 
    as: 'citas' 
});

Cita.belongsTo(Servicio, { 
    foreignKey: 'idServicio', // Esto buscará la columna mapeada a 'ID_Servicio'
    as: 'servicio'            // Alias para: include: [{ model: Servicio, as: 'servicio' }]
});

// Un Servicio puede estar en muchas Citas
Servicio.hasMany(Cita, { 
    foreignKey: 'idServicio', 
    as: 'citas' 
});

/**
 * EXPORTACIÓN DE MODELOS
 * Exportamos todo en un solo objeto para que en los controladores
 * podamos hacer: const { Cita, Cliente, Servicio } = require('../models');
 */
module.exports = {
    sequelize,
    Admin,
    Cliente,
    Servicio,
    Cita
};