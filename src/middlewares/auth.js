const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const path = req.path;
    const method = req.method;

    console.log(`🔍 JwtAuthFilter ejecutándose para: ${method} ${path}`);

    // 1. Configurar Endpoints Públicos
    const isPublicPath = 
        path.startsWith('/api/auth/') || 
        path.startsWith('/api/clientes/register') || 
        path.startsWith('/api/debug/') ||
        (method === 'GET' && path.startsWith('/api/servicios'));

    if (isPublicPath) {
        console.log("📢 Endpoint público, continuando sin autenticación");
        return next();
    }

    // 2. Extraer el header de Authorization
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("⚠️ No hay token Bearer, retornando 401");
        return res.status(401).json({ error: "No authorization token provided" });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 3. Verificar Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
        
        // 4. Establecer la autenticación en el objeto Request
        req.user = decoded; 
        
        console.log(`✅ Autenticación ESTABLECIDA para: ${decoded.correo || decoded.sub}`);
        next();
    } catch (error) {
        console.log(`❌ ERROR procesando token: ${error.message}`);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

// 5. NUEVA FUNCIÓN: Verificar si es ADMIN
const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'ROLE_ADMIN')) {
        next();
    } else {
        console.log("🚫 Acceso denegado: Se requiere rol ADMIN");
        return res.status(403).json({ error: "Acceso denegado: se requieren privilegios de administrador" });
    }
};

// EXPORTAR AMBAS (Esto quita el error de 'argument handler must be a function')
module.exports = { authenticateToken, isAdmin };