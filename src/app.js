const express = require('express');
const cors = require('cors');
const { authenticateToken } = require('./middlewares/auth');

// --- 1. IMPORTACIÓN DE CONTROLADORES (Rutas Corregidas) ---
const authRoutes = require('./controllers/authController');
const clienteRoutes = require('./controllers/clienteController'); 
const servicioRoutes = require('./controllers/servicioController');
const citaRoutes = require('./controllers/citaController');
const debugRoutes = require('./controllers/debugController');

const app = express();

// --- 2. CONFIGURACIÓN DE CORS ---
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:5173', 'https://lash-studio-tau.vercel.app', 'https://lash-studio-hykj.vercel.app'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'X-Requested-With', 'Origin'],
    exposedHeaders: ['Authorization'],
    credentials: true,
    maxAge: 3600
}));

// --- 3. PARSEO DE JSON ---
app.use(express.json()); 

// --- 4. DEFINICIÓN DE RUTAS (Equivale a SecurityConfig en Java) ---

// RUTAS PÚBLICAS
app.use('/api/auth', authRoutes);
app.use('/api/debug', debugRoutes);

// Casos específicos de rutas públicas (GET servicios y POST registro)
app.post('/api/clientes/register', clienteRoutes); 
app.get('/api/servicios', servicioRoutes);        

// RUTAS PROTEGIDAS (Requieren Token de JWT)
app.use('/api/citas', authenticateToken, citaRoutes);
app.use('/api/clientes', authenticateToken, clienteRoutes); 
app.use('/api/servicios', authenticateToken, servicioRoutes); 

module.exports = app;