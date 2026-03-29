const express = require('express');
const cors = require('cors');
const { authenticateToken } = require('./middlewares/auth');

// --- 1. IMPORTACIÓN DE CONTROLADORES ---
const authRoutes = require('./controllers/authController');
const clienteRoutes = require('./controllers/clienteController'); 
const servicioRoutes = require('./controllers/servicioController');
const citaRoutes = require('./controllers/citaController');
const debugRoutes = require('./controllers/debugController');

const app = express();

// --- 2. CONFIGURACIÓN DE CORS ---
// Agregamos las URLs de Vercel y localhost de forma explícita
const allowedOrigins = [
    'http://localhost:5173',
    'https://lash-studio-tau.vercel.app',
    'https://lash-studio-hykj.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin 'origin' (como Postman o curl)
        // O si el origin está en nuestra lista blanca
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("CORS Bloqueado para:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'X-Requested-With', 'Origin'],
    credentials: true
}));

// --- 3. PARSEO DE JSON ---
app.use(express.json()); 

// --- 4. DEFINICIÓN DE RUTAS ---

// RUTAS TOTALMENTE PÚBLICAS
app.use('/api/auth', authRoutes);
app.use('/api/debug', debugRoutes);

// Para que el frontend pueda cargar servicios y registrarse sin token al inicio
// IMPORTANTE: Asegúrate de que estos controladores manejen bien estas rutas raíz
app.use('/api/public/servicios', servicioRoutes); // Versión pública de servicios
app.post('/api/clientes/register', clienteRoutes); 

// RUTAS PROTEGIDAS (Requieren Token de JWT)
// El middleware authenticateToken protegerá todo lo que esté debajo
app.use('/api/citas', authenticateToken, citaRoutes);
app.use('/api/clientes', authenticateToken, clienteRoutes); 
app.use('/api/servicios', authenticateToken, servicioRoutes); 

module.exports = app;