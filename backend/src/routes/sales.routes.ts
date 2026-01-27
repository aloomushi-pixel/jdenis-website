import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all sales orders
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
    try {
        const orders = await prisma.salesOrder.findMany({
            include: {
                customer: true,
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
        console.error('Get sales orders error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create sales order
router.post('/', authenticate, authorize('ADMIN'), async (req: AuthRequest, res) => {
    try {
        const { orderNumber, customerId, items, notes } = req.body;

        const totalAmount = items.reduce((sum: number, item: any) =>
            sum + (item.quantity * item.unitPrice), 0
        );

        const order = await prisma.salesOrder.create({
            data: {
                orderNumber,
                customerId,
                totalAmount,
                status: 'PENDING',
                notes,
                createdBy: req.user!.userId,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    })),
                },
            },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Create sales order error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all customers
router.get('/customers', authenticate, authorize('ADMIN', 'EJECUTIVO'), async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: {
                name: 'asc',
            },
        });
        res.json(customers);
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create customer
router.post('/customers', authenticate, authorize('ADMIN', 'EJECUTIVO'), async (req, res) => {
    try {
        const { name, contactName, email, phone, address } = req.body;

        const customer = await prisma.customer.create({
            data: {
                name,
                contactName,
                email,
                phone,
                address,
            },
        });

        res.status(201).json(customer);
    } catch (error) {
        console.error('Create customer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
