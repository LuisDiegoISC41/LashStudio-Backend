require('dotenv').config(); // 1. IMPORTANTE: Debe ser la línea 1
const app = require('./src/app'); // 2. Importa la app que configuramos con CORS
const sequelize = require('./src/config/database');
const initializeData = require('./src/config/dataInitializer');

const PORT = process.env.PORT || 8080;

async function startServer() {
    try {
        // Conectar a la DB
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida.');
        
        // Sincronizar modelos
        // Nota: 'alter: false' es más seguro para producción (Render)
        await sequelize.sync({ alter: false });
        console.log('✅ Modelos sincronizados.');

        // Inicializar datos (Admin, servicios básicos, etc.)
        await initializeData();

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
    }
}

startServer();