const express = require('express');
const router = express.Router();
const { Cita, Cliente, Servicio } = require('../models'); // Importar modelos
const { Op } = require('sequelize'); // Operadores para filtros de fecha
const { authenticateToken } = require('../middlewares/auth'); // Middleware de seguridad

/** * Citas del día — usuario autenticado 
 * @GetMapping
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { fecha } = req.query; // Espera "YYYY-MM-DD"
        const citas = await Cita.findAll({
            where: { fecha },
            include: ['cliente', 'servicio'] // Carga datos relacionados
        });
        res.json(citas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/** * Citas de un mes completo — usuario autenticado (calendario)
 * @GetMapping("/mes")
 */
router.get('/mes', authenticateToken, async (req, res) => {
    try {
        const { mes } = req.query; // Espera "YYYY-MM"
        const start = `${mes}-01`;
        const end = `${mes}-31`; // Sequelize es flexible con el fin de mes

        const citas = await Cita.findAll({
            where: {
                fecha: { [Op.between]: [start, end] }
            },
            include: ['cliente', 'servicio']
        });
        res.json(citas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/** * Todas las citas de un cliente
 * @GetMapping("/cliente/:id")
 */
router.get('/cliente/:id', authenticateToken, async (req, res) => {
    try {
        const citas = await Cita.findAll({
            where: { idCliente: req.params.id },
            include: ['servicio']
        });
        res.json(citas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/** * Reservar cita — usuario autenticado 
 * @PostMapping
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { fecha, hora, idCliente, idServicio } = req.body;

        // Validar disponibilidad (existsByFechaAndHora)
        const ocupado = await Cita.findOne({ where: { fecha, hora } });
        if (ocupado) {
            return res.status(400).send("Horario no disponible.");
        }

        // Crear cita
        const nuevaCita = await Cita.create({
            fecha,
            hora,
            idCliente,
            idServicio
        });

        res.status(201).json(nuevaCita);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/** * Reagendar cita — usuario autenticado 
 * @PutMapping("/{id}")
 */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, hora } = req.body;

        const cita = await Cita.findByPk(id);
        if (!cita) return res.status(404).send("Cita no encontrada");

        // Validar disponibilidad ignorando la cita actual (existsByFechaAndHoraAndIdNot)
        const ocupado = await Cita.findOne({
            where: {
                fecha,
                hora,
                id: { [Op.ne]: id } // "ne" significa Not Equal
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

/** * Cancelar cita — admin o dueño de la cita 
 * @DeleteMapping("/{id}")
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const cita = await Cita.findByPk(id, {
            include: [{ model: Cliente, as: 'cliente' }]
        });

        if (!cita) return res.status(404).send("Cita no encontrada");

        // Lógica de seguridad idéntica a tu Java:
        const isAdmin = req.user.role === 'admin';
        const isOwner = cita.cliente.correo === req.user.correo;

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