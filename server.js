require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');
const initializeData = require('./src/config/dataInitializer');

const PORT = process.env.PORT || 8080;

async function startServer() {
    try {
        // Conectar a la DB
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida.');
        
        // Sincronizar modelos (Relaciones)
        await sequelize.sync({ alter: false });
        console.log('✅ Modelos sincronizados.');

        // Re-encriptar contraseñas si es necesario
        await initializeData();

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar:', error);
    }
}

startServer();