const sequelize = require('../config/database');
const Admin = require('./Admin');
const Cliente = require('./Cliente');
const Servicio = require('./Servicio');
const Cita = require('./Cita');

// --- Configurar Asociaciones (Relaciones) ---
// Si una Cita pertenece a un Cliente y a un Servicio:
if (Cita.associate) {
    Cita.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
    Cita.belongsTo(Servicio, { foreignKey: 'servicioId', as: 'servicio' });
}

// Exportamos todo en un solo objeto
module.exports = {
    sequelize,
    Admin,
    Cliente,
    Servicio,
    Cita
};