const express = require('express');
const router = express.Router();
const { Servicio } = require('../models'); // Importamos el modelo
const { authenticateToken, isAdmin } = require('../middlewares/auth'); // Seguridad

/** * Público — cualquiera puede ver los servicios 
 * Reemplaza a @GetMapping
 */
router.get('/', async (req, res) => {
    try {
        const servicios = await Servicio.findAll();
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/** * Solo admin — Crear servicio
 * Reemplaza a @PostMapping y @PreAuthorize("hasRole('ADMIN')")
 */
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const nuevoServicio = await Servicio.create(req.body);
        res.status(201).json(nuevoServicio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/** * Solo admin — Actualizar servicio
 * Reemplaza a @PutMapping("/{id}")
 */
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio } = req.body;

        const servicio = await Servicio.findByPk(id);
        
        if (!servicio) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        // Actualizamos los campos
        servicio.nombre = nombre || servicio.nombre;
        servicio.descripcion = descripcion || servicio.descripcion;
        servicio.precio = precio || servicio.precio;

        await servicio.save();
        res.json(servicio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/** * Solo admin — Eliminar servicio
 * Reemplaza a @DeleteMapping("/{id}")
 */
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const servicio = await Servicio.findByPk(id);

        if (!servicio) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        // Verificar si hay citas asociadas a este servicio
        const { Cita } = require('../models');
        const citasAsociadas = await Cita.count({ where: { idServicio: id } });

        if (citasAsociadas > 0) {
            return res.status(400).json({ 
                message: "No se puede eliminar el servicio porque tiene citas asociadas. Elimine las citas primero." 
            });
        }

        await servicio.destroy();
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;