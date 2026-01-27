import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT, authorize } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// @route   GET /api/resources
// @desc    Get all resources with optional category filter
// @access  Private
router.get('/', authenticateJWT, async (req: any, res) => {
    try {
        const { category } = req.query;

        const resources = await prisma.resource.findMany({
            where: category ? { category: category as any } : undefined,
            orderBy: { createdAt: 'desc' },
        });

        res.json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Error al obtener recursos' });
    }
});

// @route   POST /api/resources
// @desc    Create new resource
// @access  Private (Admin, Ejecutivo)
router.post('/', authenticateJWT, authorize('ADMIN', 'EJECUTIVO'), async (req: any, res) => {
    try {
        const { id, category, title, format, quantity, brand, imageUrl, satCode, rawMaterialComposition } = req.body;

        const resource = await prisma.resource.create({
            data: {
                id,
                category,
                title,
                format,
                quantity: quantity || 0,
                brand,
                imageUrl,
                satCode,
                rawMaterialComposition,
            },
        });

        // TODO: Add EventLog when model is implemented
        console.log(`Resource created: ${resource.id} by user ${req.user.id}`);

        res.status(201).json(resource);
    } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({ error: 'Error al crear recurso' });
    }
});

// @route   PUT /api/resources/:id
// @desc    Update resource
// @access  Private (Admin, Ejecutivo)
router.put('/:id', authenticateJWT, authorize('ADMIN', 'EJECUTIVO'), async (req: any, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const resource = await prisma.resource.update({
            where: { id },
            data: updates,
        });

        res.json(resource);
    } catch (error) {
        console.error('Error updating resource:', error);
        res.status(500).json({ error: 'Error al actualizar recurso' });
    }
});

// @route   DELETE /api/resources/:id
// @desc    Delete resource
// @access  Private (Admin only)
router.delete('/:id', authenticateJWT, authorize('ADMIN'), async (req: any, res) => {
    try {
        const { id } = req.params;

        await prisma.resource.delete({
            where: { id },
        });

        res.json({ message: 'Recurso eliminado exitosamente' });
    } catch (error) {
        console.error('Error deleting resource:', error);
        res.status(500).json({ error: 'Error al eliminar recurso' });
    }
});

// @route   GET /api/resources/categories
// @desc    Get resource categories summary
// @access  Private
router.get('/categories', authenticateJWT, async (req: any, res) => {
    try {
        const categories = await prisma.resource.groupBy({
            by: ['category'],
            _count: true,
            _sum: { quantity: true },
        });

        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

export default router;
