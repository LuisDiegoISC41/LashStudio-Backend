const express = require('express');
const router = express.Router();
const { Cita, Cliente, Servicio } = require('../models'); 
const { Op } = require('sequelize'); 
const { authenticateToken } = require('../middlewares/auth'); 

/** * Citas del día — usuario autenticado 
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { fecha } = req.query; 
        const citas = await Cita.findAll({
            where: { fecha },
            include: [
                { model: Cliente, as: 'cliente' },
                { model: Servicio, as: 'servicio' }
            ]
        });
        res.json(citas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/** * Citas de un mes completo — Calendario blindado
 */
router.get('/mes', authenticateToken, async (req, res) => {
    try {
        const { mes } = req.query; // Ejemplo: "2026-04"
        if (!mes) return res.status(400).json({ error: "El parámetro mes es requerido" });

        // Separamos el año y el mes para calcular el último día real
        const [year, month] = mes.split('-').map(Number);
        const start = `${year}-${month.toString().padStart(2, '0')}-01`;
        
        // El día 0 del mes siguiente nos devuelve el último día del mes actual
        const ultimoDia = new Date(year, month, 0).getDate();
        const end = `${year}-${month.toString().padStart(2, '0')}-${ultimoDia}`;

        const citas = await Cita.findAll({
            where: {
                fecha: { [Op.between]: [start, end] }
            },
            include: [
                { model: Cliente, as: 'cliente' },
                { model: Servicio, as: 'servicio' }
            ],
            order: [['fecha', 'ASC'], ['hora', 'ASC']]
        });

        res.json(citas);
    } catch (error) {
        console.error("Error en calendario:", error.message);
        res.status(500).json({ message: "Error al cargar el calendario: " + error.message });
    }
});

/** * Todas las citas de un cliente
 */
router.get('/cliente/:id', authenticateToken, async (req, res) => {
    try {
        const citas = await Cita.findAll({
            where: { idCliente: req.params.id },
            include: [{ model: Servicio, as: 'servicio' }]
        });
        res.json(citas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/** * Reservar cita
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { fecha, hora, idCliente, idServicio, status, motivo } = req.body;
        const isBlock = status === 'fuera';

        if (!fecha || !hora) {
            return res.status(400).send("Fecha y hora son requeridos.");
        }

        if (isBlock && req.user.role.toUpperCase() !== 'ADMIN') {
            return res.status(403).send("No autorizado para bloquear horarios.");
        }

        if (!isBlock && (!idCliente || !idServicio)) {
            return res.status(400).send("Cliente y servicio son requeridos.");
        }

        const ocupado = await Cita.findOne({ where: { fecha, hora } });
        if (ocupado) {
            return res.status(400).send("Horario no disponible.");
        }

        const nuevaCita = await Cita.create({
            fecha,
            hora,
            idCliente: isBlock ? null : idCliente,
            idServicio: isBlock ? null : idServicio,
            status: isBlock ? 'fuera' : 'confirmada',
            motivo: isBlock ? motivo || null : null
        });

        // Incluir asociaciones para la respuesta
        const citaConDatos = await Cita.findByPk(nuevaCita.id, {
            include: [
                { model: Cliente, as: 'cliente' },
                { model: Servicio, as: 'servicio' }
            ]
        });

        res.status(201).json(citaConDatos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/** * Reagendar cita
 */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, hora } = req.body;

        const cita = await Cita.findByPk(id);
        if (!cita) return res.status(404).send("Cita no encontrada");

        const ocupado = await Cita.findOne({
            where: {
                fecha,
                hora,
                id: { [Op.ne]: id } 
            }
        });

        if (ocupado) return res.status(400).send("Horario no disponible.");

        cita.fecha = fecha;
        cita.hora = hora;
        await cita.save();

        res.json(cita);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/** * Cancelar cita
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const cita = await Cita.findByPk(id, {
            include: [{ model: Cliente, as: 'cliente' }]
        });

        if (!cita) return res.status(404).send("Cita no encontrada");

        // Normalizamos el rol a mayúsculas para comparar con ADMIN
        const isAdmin = req.user.role.toUpperCase() === 'ADMIN';
        const isOwner = cita.cliente && (cita.cliente.Correo === req.user.correo || cita.cliente.correo === req.user.correo);

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: "No tienes permiso para cancelar esta cita" });
        }

        await cita.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;