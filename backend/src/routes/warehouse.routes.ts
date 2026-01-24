import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { updateStock } from './inventory.routes';

const router = Router();

// Get storage racks
router.get('/racks', authenticate, authorize('ADMIN', 'ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL'), async (req, res) => {
    try {
        const racks = await prisma.storageRack.findMany({
            include: {
                location: true,
            },
            orderBy: {
                rackCode: 'asc',
            },
        });
        res.json(racks);
    } catch (error) {
        console.error('Get racks error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get receiving logs
router.get('/receiving', authenticate, authorize('ADMIN', 'ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL'), async (req, res) => {
    try {
        const logs = await prisma.receivingLog.findMany({
            include: {
                product: true,
                verifiedByUser: {
                    select: {
                        fullName: true,
                    },
                },
            },
            orderBy: {
                receivedAt: 'desc',
            },
        });
        res.json(logs);
    } catch (error) {
        console.error('Get receiving logs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create receiving log (receive products from factory)
router.post('/receiving', authenticate, authorize('ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL'), async (req: AuthRequest, res) => {
    try {
        const { source, productId, quantity, rackCode, notes } = req.body;

        // Get warehouse location
        const warehouseLocation = await prisma.inventoryLocation.findFirst({
            where: { locationType: 'WAREHOUSE' },
        });

        if (!warehouseLocation) {
            return res.status(400).json({ error: 'Warehouse location not found' });
        }

        // If coming from factory, decrease factory stock
        if (source === 'FACTORY') {
            const factoryLocation = await prisma.inventoryLocation.findFirst({
                where: { locationType: 'FACTORY' },
            });

            if (factoryLocation) {
                await updateStock(productId, factoryLocation.id, -quantity, req.user!.userId, req.app.get('io'));
            }
        }

        // Create receiving log
        const log = await prisma.receivingLog.create({
            data: {
                source,
                productId,
                quantity,
                verifiedBy: req.user!.userId,
                notes,
            },
            include: {
                product: true,
            },
        });

        // Update warehouse stock
        await updateStock(productId, warehouseLocation.id, quantity, req.user!.userId, req.app.get('io'));

        // Update rack utilization if provided
        if (rackCode) {
            const rack = await prisma.storageRack.findUnique({
                where: { rackCode },
            });

            if (rack) {
                await prisma.storageRack.update({
                    where: { rackCode },
                    data: {
                        currentUtilization: rack.currentUtilization + quantity,
                    },
                });
            }
        }

        res.status(201).json(log);
    } catch (error) {
        console.error('Create receiving log error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get dispatch logs
router.get('/dispatch', authenticate, authorize('ADMIN', 'ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL'), async (req, res) => {
    try {
        const logs = await prisma.dispatchLog.findMany({
            include: {
                salesOrder: {
                    include: {
                        customer: true,
                    },
                },
                product: true,
                preparedByUser: {
                    select: {
                        fullName: true,
                    },
                },
                handoffRecords: {
                    include: {
                        transporter: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                dispatchedAt: 'desc',
            },
        });
        res.json(logs);
    } catch (error) {
        console.error('Get dispatch logs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create dispatch log
router.post('/dispatch', authenticate, authorize('ALMACEN_PRODUCTO_FINAL'), async (req: AuthRequest, res) => {
    try {
        const { salesOrderId, productId, quantity, transporterId, notes } = req.body;

        // Get warehouse location
        const warehouseLocation = await prisma.inventoryLocation.findFirst({
            where: { locationType: 'WAREHOUSE' },
        });

        if (!warehouseLocation) {
            return res.status(400).json({ error: 'Warehouse location not found' });
        }

        // Create dispatch log
        const log = await prisma.dispatchLog.create({
            data: {
                salesOrderId,
                productId,
                quantity,
                preparedBy: req.user!.userId,
                transporterId,
                notes,
            },
            include: {
                product: true,
                salesOrder: true,
            },
        });

        // Update warehouse stock (decrease)
        await updateStock(productId, warehouseLocation.id, -quantity, req.user!.userId, req.app.get('io'));

        res.status(201).json(log);
    } catch (error) {
        console.error('Create dispatch log error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create handoff record (transition to transporter)
router.post('/handoff', authenticate, authorize('ALMACEN_PRODUCTO_FINAL'), async (req: AuthRequest, res) => {
    try {
        const { dispatchLogId, transporterId, signatureData, notes } = req.body;

        const handoff = await prisma.handoffRecord.create({
            data: {
                dispatchLogId,
                warehouseStaffId: req.user!.userId,
                transporterId,
                signatureData,
                notes,
            },
            include: {
                dispatchLog: {
                    include: {
                        product: true,
                        salesOrder: true,
                    },
                },
                transporter: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
        });

        res.status(201).json(handoff);
    } catch (error) {
        console.error('Create handoff error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
