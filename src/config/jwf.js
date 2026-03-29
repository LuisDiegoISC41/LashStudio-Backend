const jwt = require('jsonwebtoken');

// Estos valores vienen de tu archivo .env
const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';
const EXPIRATION = process.env.JWT_EXPIRATION || '24h'; // En Node se puede usar '1h', '7d', etc.

/**
 * Genera un token JWT (Reemplaza a generateToken)
 */
const generateToken = (user) => {
    // Definimos los claims (el payload)
    const payload = {
        sub: user.correo,        // Subject (username/email)
        roles: [user.role],      // Incluimos los roles como hacías en Java
        nombre: user.nombre      // Puedes agregar más info si quieres
    };

    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION });
};

/**
 * Verifica si el token es válido y extrae los datos (Reemplaza a isTokenValid y extractAllClaims)
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null; // Si el token expiró o es inválido, devuelve null
    }
};

module.exports = {
    generateToken,
    verifyToken
};