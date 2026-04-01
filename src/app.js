const express = require('express');
const cors = require('cors');
const { authenticateToken } = require('./middlewares/auth');

const authRoutes = require('./controllers/authController');
const clienteRoutes = require('./controllers/clienteController'); 
const servicioRoutes = require('./controllers/servicioController');
const citaRoutes = require('./controllers/citaController');
const adminRoutes = require('./controllers/adminController');

const app = express();

// 1. Configuración de CORS
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://lash-studio-tau.vercel.app',
        'https://lash-studio-hykj.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
    credentials: true
}));

app.use(express.json()); 

// 2. RUTAS PÚBLICAS (Sin token)
// Usamos .use() para que el Router interno de cada controlador tome el mando
app.use('/api/auth', authRoutes);       // Login
app.use('/api/servicios', servicioRoutes); // GET /api/servicios (Público según tu controlador)
app.use('/api/clientes/register', clienteRoutes); // Registro

// 3. RUTAS PROTEGIDAS (Con token)
app.use('/api/citas', authenticateToken, citaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/admins', adminRoutes);

module.exports = app;