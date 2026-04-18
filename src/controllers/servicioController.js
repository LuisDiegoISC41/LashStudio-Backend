const express = require('express');
const router = express.Router();
const { Servicio } = require('../models'); // Importamos el modelo
const { authenticateToken, isAdmin } = require('../middlewares/auth'); // Seguridad
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear carpeta uploads si no existe
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Directorio uploads creado:', uploadsDir);
} else {
    console.log('✅ Directorio uploads ya existe:', uploadsDir);
}

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Carpeta donde se guardarán las imágenes
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

// Middleware para manejar errores de multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'La imagen no puede ser mayor a 5MB' });
        }
    }
    if (error.message === 'Solo se permiten archivos de imagen') {
        return res.status(400).json({ message: error.message });
    }
    next(error);
};

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
router.post('/', authenticateToken, isAdmin, upload.single('imagen'), handleMulterError, async (req, res) => {
    try {
        console.log('➕ Creando nuevo servicio');
        console.log('📁 Archivo recibido:', req.file ? req.file.filename : 'Ninguno');
        console.log('📝 Datos recibidos:', req.body);

        const { nombre, descripcion, precio } = req.body;
        const imagen = req.file ? req.file.filename : null;

        const nuevoServicio = await Servicio.create({
            nombre,
            descripcion,
            precio: parseInt(precio),
            imagen
        });
        
        console.log('✅ Servicio creado exitosamente:', nuevoServicio.id);
        res.status(201).json(nuevoServicio);
    } catch (error) {
        console.error('❌ Error creando servicio:', error);
        res.status(400).json({ message: error.message });
    }
});

/** * Solo admin — Actualizar servicio
 * Reemplaza a @PutMapping("/{id}")
 */
router.put('/:id', authenticateToken, isAdmin, upload.single('imagen'), handleMulterError, async (req, res) => {
    try {
        console.log('🔄 Actualizando servicio:', req.params.id);
        console.log('📁 Archivo recibido:', req.file ? req.file.filename : 'Ninguno');
        console.log('📝 Datos recibidos:', req.body);

        const { id } = req.params;
        const { nombre, descripcion, precio } = req.body;

        const servicio = await Servicio.findByPk(id);

        if (!servicio) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        // Actualizamos los campos
        if (nombre !== undefined) servicio.nombre = nombre;
        if (descripcion !== undefined) servicio.descripcion = descripcion;
        if (precio !== undefined) servicio.precio = parseInt(precio);
        
        // Solo actualizar imagen si se envió un archivo
        if (req.file) {
            servicio.imagen = req.file.filename;
            console.log('🖼️ Imagen actualizada:', req.file.filename);
        }

        await servicio.save();
        console.log('✅ Servicio actualizado exitosamente');
        res.json(servicio);
    } catch (error) {
        console.error('❌ Error actualizando servicio:', error);
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