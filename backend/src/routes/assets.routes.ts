import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all vehicles
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            orderBy: {
                vehicleNumber: 'asc',
            },
        });
        res.json(vehicles);
    } catch (error) {
        console.error('Get vehicles error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get delivery assignments
router.get('/deliveries', authenticate, authorize('ADMIN', 'ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL', 'TRANSPORTISTA'), async (req: AuthRequest, res) => {
    try {
        const where = req.user!.role === 'TRANSPORTISTA'
            ? { transporterId: req.user!.userId }
            : {};

        const deliveries = await prisma.deliveryAssignment.findMany({
            where,
            include: {
                salesOrder: {
                    include: {
                        customer: true,
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
                vehicle: true,
                transporter: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                assignedAt: 'desc',
            },
        });
        res.json(deliveries);
    } catch (error) {
        console.error('Get deliveries error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Complete delivery (for transporters)
router.patch('/deliveries/:id/complete', authenticate, authorize('TRANSPORTISTA'), async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const delivery = await prisma.deliveryAssignment.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                notes,
            },
            include: {
                salesOrder: true,
                vehicle: true,
            },
        });

        // Update sales order status
        await prisma.salesOrder.update({
            where: { id: delivery.salesOrderId },
            data: {
                status: 'DELIVERED',
                deliveredAt: new Date(),
            },
        });

        res.json(delivery);
    } catch (error) {
        console.error('Complete delivery error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
