const express = require('express');
const router = express.Router();
const { Servicio } = require('../models'); // Importamos el modelo
const { authenticateToken, isAdmin } = require('../middlewares/auth'); // Seguridad
const multer = require('multer');
const path = require('path');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'servicio-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máximo
    },
    fileFilter: (req, file, cb) => {
        // Solo permitir imágenes
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    }
});

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
router.post('/', authenticateToken, isAdmin, upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body;
        const imagen = req.file ? req.file.filename : null;

        const nuevoServicio = await Servicio.create({
            nombre,
            descripcion,
            precio: parseInt(precio),
            imagen
        });
        res.status(201).json(nuevoServicio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/** * Solo admin — Actualizar servicio
 * Reemplaza a @PutMapping("/{id}")
 */
router.put('/:id', authenticateToken, isAdmin, upload.single('imagen'), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio } = req.body;
        const imagen = req.file ? req.file.filename : null;

        const servicio = await Servicio.findByPk(id);

        if (!servicio) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        // Actualizamos los campos
        servicio.nombre = nombre || servicio.nombre;
        servicio.descripcion = descripcion || servicio.descripcion;
        servicio.precio = precio ? parseInt(precio) : servicio.precio;
        if (imagen) {
            servicio.imagen = imagen;
        }

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