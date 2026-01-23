import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { updateStock } from './inventory.routes';

const router = Router();

// Get all production batches
router.get('/batches', authenticate, authorize('ADMIN', 'FACTORY_MANAGER'), async (req, res) => {
    try {
        const batches = await prisma.productionBatch.findMany({
            include: {
                materialConsumptions: {
                    include: {
                        product: true,
                    },
                },
                productionOutputs: {
                    include: {
                        product: true,
                    },
                },
                createdByUser: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                startDate: 'desc',
            },
        });
        res.json(batches);
    } catch (error) {
        console.error('Get production batches error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new production batch
router.post('/batches', authenticate, authorize('ADMIN', 'FACTORY_MANAGER'), async (req: AuthRequest, res) => {
    try {
        const { batchNumber, notes } = req.body;

        const batch = await prisma.productionBatch.create({
            data: {
                batchNumber,
                notes,
                status: 'IN_PROGRESS',
                createdBy: req.user!.userId,
            },
            include: {
                createdByUser: {
                    select: {
                        fullName: true,
                    },
                },
            },
        });

        res.status(201).json(batch);
    } catch (error) {
        console.error('Create batch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Record material consumption
router.post('/batches/:batchId/materials', authenticate, authorize('FACTORY_MANAGER'), async (req: AuthRequest, res) => {
    try {
        const { batchId } = req.params;
        const { productId, quantityUsed } = req.body;

        // Get factory location
        const factoryLocation = await prisma.inventoryLocation.findFirst({
            where: { locationType: 'FACTORY' },
        });

        if (!factoryLocation) {
            return res.status(400).json({ error: 'Factory location not found' });
        }

        // Record material consumption
        const consumption = await prisma.materialConsumption.create({
            data: {
                batchId,
                productId,
                quantityUsed,
            },
            include: {
                product: true,
            },
        });

        // Update stock (decrease)
        await updateStock(productId, factoryLocation.id, -quantityUsed, req.user!.userId, req.app.get('io'));

        res.status(201).json(consumption);
    } catch (error) {
        console.error('Record material consumption error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Record production output
router.post('/batches/:batchId/output', authenticate, authorize('FACTORY_MANAGER'), async (req: AuthRequest, res) => {
    try {
        const { batchId } = req.params;
        const { productId, quantityProduced } = req.body;

        // Get factory location
        const factoryLocation = await prisma.inventoryLocation.findFirst({
            where: { locationType: 'FACTORY' },
        });

        if (!factoryLocation) {
            return res.status(400).json({ error: 'Factory location not found' });
        }

        // Record production output
        const output = await prisma.productionOutput.create({
            data: {
                batchId,
                productId,
                quantityProduced,
                verifiedBy: req.user!.userId,
            },
            include: {
                product: true,
            },
        });

        // Update stock (increase)
        await updateStock(productId, factoryLocation.id, quantityProduced, req.user!.userId, req.app.get('io'));

        res.status(201).json(output);
    } catch (error) {
        console.error('Record production output error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Complete production batch
router.patch('/batches/:batchId/complete', authenticate, authorize('FACTORY_MANAGER'), async (req, res) => {
    try {
        const { batchId } = req.params;

        const batch = await prisma.productionBatch.update({
            where: { id: batchId },
            data: {
                status: 'COMPLETED',
                endDate: new Date(),
            },
            include: {
                materialConsumptions: {
                    include: {
                        product: true,
                    },
                },
                productionOutputs: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        res.json(batch);
    } catch (error) {
        console.error('Complete batch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
