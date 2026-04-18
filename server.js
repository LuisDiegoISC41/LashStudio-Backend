require('dotenv').config();
const app = require('./src/app'); // <--- Verifica que la ruta sea esta
const { sequelize } = require('./src/models'); // Importamos sequelize desde los modelos
const initializeData = require('./src/config/dataInitializer');

const PORT = process.env.PORT || 8080;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ DB Conectada');
        await sequelize.sync({ alter: true }); 
        console.log("✅ Estructura de tablas actualizada en Render");

        // Aseguramos que las columnas de cita puedan aceptar bloques sin cliente ni servicio
        await sequelize.query('ALTER TABLE cita ALTER COLUMN "ID_Cliente" DROP NOT NULL');
        await sequelize.query('ALTER TABLE cita ALTER COLUMN "ID_Servicio" DROP NOT NULL');
        console.log('✅ Columnas ID_Cliente e ID_Servicio ajustadas para permitir NULL');

        await initializeData();
        app.listen(PORT, () => console.log(`🚀 Puerto: ${PORT}`));
    } catch (e) {
        console.error('❌ Error:', e);
    }
}
startServer();