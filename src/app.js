const express = require('express');
const cors = require('cors');
const { authenticateToken } = require('./middlewares/auth');

const authRoutes = require('./controllers/authController');
const clienteRoutes = require('./controllers/clienteController'); 
const servicioRoutes = require('./controllers/servicioController');
const citaRoutes = require('./controllers/citaController');

const app = express();

// 1. CORS (Configuración limpia)
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://lash-studio-tau.vercel.app',
        'https://lash-studio-hykj.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true
}));

// 2. Middlewares base
app.use(express.json()); 

// 3. RUTAS PÚBLICAS (Van arriba para que no las bloquee el 404 o el Token)
app.use('/api/auth', authRoutes); // Aquí está el POST /login
app.get('/api/servicios', servicioRoutes); // Público para que carguen al inicio
app.post('/api/clientes/register', clienteRoutes); // Registro público

// 4. RUTAS PROTEGIDAS (Necesitan Token)
app.use('/api/citas', authenticateToken, citaRoutes);
app.use('/api/clientes', authenticateToken, clienteRoutes);
app.use('/api/admin/servicios', authenticateToken, servicioRoutes); // Para gestión de admin

module.exports = app;