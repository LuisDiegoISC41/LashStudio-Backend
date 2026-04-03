const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const { Cliente } = require('../models'); 
const { authenticateToken, isAdmin } = require('../middlewares/auth');

/** * 1. LISTAR CLIENTES — Solo Admin 
 * Reemplaza a @GetMapping y @PreAuthorize("hasRole('ADMIN')")
 */
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        // Traemos todos los clientes pero excluimos el campo password por seguridad
        const clientes = await Cliente.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/** * 2. REGISTRO DE NUEVO CLIENTE — Público 
 * Reemplaza a @PostMapping("/register")
 */
router.post('/register', async (req, res) => {
    try {
        const { correo, password } = req.body;

        // 🔍 Verificar si el correo ya existe
        const existe = await Cliente.findOne({ where: { correo } });
        if (existe) {
            return res.status(400).json({ message: "El correo ya está registrado." });
        }

        // 🔐 Encriptar contraseña (10 rondas de sal es el estándar)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Crear el registro en la DB
        const nuevoCliente = await Cliente.create({
            ...req.body,
            password: hashedPassword
        });

        // 🛡️ Limpieza de seguridad: No enviar el hash al frontend
        const clienteResponse = nuevoCliente.get({ clone: true });
        delete clienteResponse.password;

        console.log(`✅ Nuevo cliente registrado: ${clienteResponse.correo}`);
        res.status(201).json(clienteResponse);

    } catch (error) {
        // Si hay un error de validación (ej: campo obligatorio vacío)
        res.status(400).json({ message: error.message });
    }
});

/** * 3. BUSCAR CLIENTES — Solo Admin
 * Para búsqueda por nombre, apellido, correo o teléfono
 */
router.get('/search', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length < 2) {
            return res.json([]);
        }

        const clientes = await Cliente.findAll({
            where: {
                [require('sequelize').Op.or]: [
                    { nombre: { [require('sequelize').Op.iLike]: `%${q}%` } },
                    { apellidoPaterno: { [require('sequelize').Op.iLike]: `%${q}%` } },
                    { apellidoMaterno: { [require('sequelize').Op.iLike]: `%${q}%` } },
                    { correo: { [require('sequelize').Op.iLike]: `%${q}%` } },
                    { telefono: { [require('sequelize').Op.iLike]: `%${q}%` } }
                ]
            },
            attributes: { exclude: ['password'] },
            limit: 10
        });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/** * 4. ACTUALIZAR PERFIL — Usuario autenticado 
 * Reemplaza a @PutMapping("/{id}")
 */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;

        // 🛡️ Validación de Identidad: 
        // Solo permitimos que el cliente se edite a SÍ MISMO (o que sea Admin)
        if (req.user.role !== 'ADMIN' && req.user.id !== id) {
            return res.status(403).json({ message: "No tienes permiso para editar este perfil." });
        }

        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        // Actualizar campos básicos si vienen en el body
        cliente.nombre = body.nombre || cliente.nombre;
        cliente.apellidoPaterno = body.apellidoPaterno || cliente.apellidoPaterno;
        cliente.apellidoMaterno = body.apellidoMaterno || cliente.apellidoMaterno;
        cliente.telefono = body.telefono || cliente.telefono;

        // Si cambia el correo
        if (body.correo && body.correo.trim() !== "") {
            cliente.correo = body.correo;
        }

        // Si cambia la contraseña, la re-encriptamos
        if (body.password && body.password.trim() !== "") {
            cliente.password = await bcrypt.hash(body.password, 10);
        }

        await cliente.save();

        // Limpieza de seguridad para la respuesta
        const clienteActualizado = cliente.get({ clone: true });
        delete clienteActualizado.password;

        res.json(clienteActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;