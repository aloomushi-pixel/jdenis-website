import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private
router.get('/', authenticateJWT, async (req: any, res) => {
    try {
        const { status } = req.query;

        const orders = await prisma.order.findMany({
            where: status ? { currentStatus: status } : undefined,
            include: {
                customer: true,
                items: {
                    include: {
                        resource: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (blockchain)
// @access  Private
router.put('/:id/status', authenticateJWT, async (req: any, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        // Parse existing blockchain
        const blockchain = JSON.parse(order.blockchainHistory as string);

        // Add new entry
        const newEntry = {
            status,
            timestamp: new Date().toISOString(),
            user: req.user.fullName,
            userId: req.user.id,
            notes: notes || '',
        };

        blockchain.push(newEntry);

        // Update order
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                currentStatus: status,
                blockchainHistory: JSON.stringify(blockchain),
            },
            include: {
                customer: true,
                items: {
                    include: {
                        resource: true,
                    },
                },
            },
        });

        // Log event
        await prisma.eventLog.create({
            data: {
                eventType: 'VENTA',
                userId: req.user.id,
                details: {
                    action: 'order_status_updated',
                    orderId: id,
                    newStatus: status,
                },
            },
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Error al actualizar estado del pedido' });
    }
});

// @route   GET /api/orders/:id/timeline
// @desc    Get order blockchain timeline
// @access  Private
router.get('/:id/timeline', authenticateJWT, async (req: any, res) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id },
            select: {
                blockchainHistory: true,
                orderNumber: true,
            },
        });

        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        const timeline = JSON.parse(order.blockchainHistory as string);

        res.json({
            orderNumber: order.orderNumber,
            timeline,
        });
    } catch (error) {
        console.error('Error fetching timeline:', error);
        res.status(500).json({ error: 'Error al obtener timeline' });
    }
});

export default router;
