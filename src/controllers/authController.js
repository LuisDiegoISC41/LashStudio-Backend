const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin, Cliente } = require('../models');

/**
 * LOGIN ÚNICO — Maneja tanto Admins como Clientes
 * Reemplaza a tu lógica de AuthenticationManager en Spring
 */
router.post('/login', async (req, res) => {
    const { correo, password } = req.body;

    try {
        console.log(`🔐 Intento de login para: ${correo}`);

        // 1. Buscar primero en la tabla de Admins
        let usuario = await Admin.findOne({ where: { correo } });
        let role = 'ADMIN';

        // 2. Si no es admin, buscar en la tabla de Clientes
        if (!usuario) {
            usuario = await Cliente.findOne({ where: { correo } });
            role = 'CLIENTE';
        }

        // 3. Si no existe en ninguna, error
        if (!usuario) {
            console.log(`❌ Usuario no encontrado: ${correo}`);
            return res.status(404).json({ error: "El correo no está registrado" });
        }

        // 4. Verificar la contraseña con bcrypt
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) {
            console.log(`⚠️ Contraseña incorrecta para: ${correo}`);
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // 5. Generar el Token JWT
        // Usamos la misma estructura que esperaba tu frontend de Java
        const token = jwt.sign(
            { 
                id: usuario.id || usuario.ID_Admin || usuario.ID_Cliente, 
                correo: usuario.correo, 
                role: role 
            },
            process.env.JWT_SECRET || 'lashStudioSecretKey2024SuperSegura',
            { expiresIn: '24h' }
        );

        console.log(`✅ Login exitoso: ${correo} [${role}]`);

        // 6. Responder con el formato que espera tu App de React
        res.json({
            token,
            role,
            nombre: usuario.nombre,
            id: usuario.id || usuario.ID_Admin || usuario.ID_Cliente
        });

    } catch (error) {
        console.error("🔥 Error en el login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;