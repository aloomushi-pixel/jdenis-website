import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Get all purchase orders
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
    try {
        const orders = await prisma.purchaseOrder.findMany({
            include: {
                supplier: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                createdByUser: {
                    select: {
                        fullName: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(orders);
    } catch (error) {
        console.error('Get purchase orders error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all suppliers
router.get('/suppliers', authenticate, authorize('ADMIN'), async (req, res) => {
    try {
        const suppliers = await prisma.supplier.findMany({
            orderBy: {
                name: 'asc',
            },
        });
        res.json(suppliers);
    } catch (error) {
        console.error('Get suppliers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
