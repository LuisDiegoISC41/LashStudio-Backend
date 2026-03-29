const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth'); // Tu middleware de JWT

/**
 * Endpoint Público
 * Reemplaza a @GetMapping("/public-test")
 */
router.get('/public-test', (req, res) => {
    res.json({
        status: "OK",
        message: "Public endpoint works",
        timestamp: Date.now()
    });
});

/**
 * Check de Autenticación
 * Reemplaza a @GetMapping("/auth-check")
 */
router.get('/auth-check', authenticateToken, (req, res) => {
    // Si llega aquí es porque el middleware authenticateToken pasó con éxito
    // En Node, los datos del usuario suelen guardarse en req.user
    
    if (!req.user) {
        return res.status(401).json({
            authenticated: false,
            message: "Not authenticated"
        });
    }

    res.json({
        authenticated: true,
        username: req.user.correo, // O req.user.username dependiendo de tu JWT
        roles: [req.user.role],     // En Node solemos manejar un string, lo ponemos en array para que coincida con Java
        message: "Authentication successful"
    });
});

module.exports = router;