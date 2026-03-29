require('dotenv').config();
const app = require('./src/app'); // <--- Verifica que la ruta sea esta
const { sequelize } = require('./src/models'); // Importamos sequelize desde los modelos
const initializeData = require('./src/config/dataInitializer');

const PORT = process.env.PORT || 8080;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ DB Conectada');
        await sequelize.sync({ alter: false });
        await initializeData();
        app.listen(PORT, () => console.log(`🚀 Puerto: ${PORT}`));
    } catch (e) {
        console.error('❌ Error:', e);
    }
}
startServer();