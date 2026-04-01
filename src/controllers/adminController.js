const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Admin } = require('../models');
const { authenticateToken } = require('../middlewares/auth');

/** * ACTUALIZAR PERFIL DEL ADMIN — Solo el propio admin o autorizados
 */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Solo el propio admin se modifica a sí mismo (o super-admin si estuviese)
        if (req.user.role?.toUpperCase() !== 'ADMIN' || req.user.id !== id) {
            return res.status(403).json({ message: 'No tienes permiso para editar este Admin.' });
        }

        const admin = await Admin.findByPk(id);
        if (!admin) return res.status(404).json({ message: 'Admin no encontrado.' });

        const body = req.body;
        admin.nombre = body.nombre || admin.nombre;
        admin.apellidoPaterno = body.apellidoPaterno || admin.apellidoPaterno;
        admin.apellidoMaterno = body.apellidoMaterno || admin.apellidoMaterno;

        if (body.correo && body.correo.trim() !== '') {
            admin.correo = body.correo;
        }

        if (body.password && body.password.trim() !== '') {
            admin.password = await bcrypt.hash(body.password, 10);
        }

        await admin.save();

        const adminActualizado = admin.get({ clone: true });
        delete adminActualizado.password;

        res.json(adminActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
