import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT, authorize } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// @route   GET /api/quotations
// @desc    Get all quotations
// @access  Private (Ejecutivo, Admin)
router.get('/', authenticateJWT, authorize('ADMIN', 'EJECUTIVO'), async (req: any, res) => {
    try {
        const quotations = await prisma.quotation.findMany({
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

        res.json(quotations);
    } catch (error) {
        console.error('Error fetching quotations:', error);
        res.status(500).json({ error: 'Error al obtener cotizaciones' });
    }
});

// @route   POST /api/quotations
// @desc    Create new quotation
// @access  Private (Ejecutivo, Admin)
router.post('/', authenticateJWT, authorize('ADMIN', 'EJECUTIVO'), async (req: any, res) => {
    try {
        const { customerId, items, validUntil, notes } = req.body;

        // Calculate total
        const totalAmount = items.reduce((sum: number, item: any) => {
            return sum + (item.quantity * item.unitPrice);
        }, 0);

        // Generate quotation number
        const count = await prisma.quotation.count();
        const quotationNumber = `COT-${String(count + 1).padStart(6, '0')}`;

        const quotation = await prisma.quotation.create({
            data: {
                quotationNumber,
                customerId,
                totalAmount,
                status: 'DRAFT',
                validUntil: validUntil ? new Date(validUntil) : null,
                notes,
                createdBy: req.user.id,
                items: {
                    create: items.map((item: any) => ({
                        resourceId: item.resourceId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        resource: true,
                    },
                },
                customer: true,
            },
        });

        res.status(201).json(quotation);
    } catch (error) {
        console.error('Error creating quotation:', error);
        res.status(500).json({ error: 'Error al crear cotización' });
    }
});

// @route   PUT /api/quotations/:id/convert
// @desc    Convert quotation to order
// @access  Private (Ejecutivo, Admin)
router.put('/:id/convert', authenticateJWT, authorize('ADMIN', 'EJECUTIVO'), async (req: any, res) => {
    try {
        const { id } = req.params;
        const { deliveryDate } = req.body;

        const quotation = await prisma.quotation.findUnique({
            where: { id },
            include: {
                items: true,
            },
        });

        if (!quotation) {
            return res.status(404).json({ error: 'Cotización no encontrada' });
        }

        if (quotation.status === 'CONVERTED') {
            return res.status(400).json({ error: 'Esta cotización ya fue convertida' });
        }

        // Generate order number
        const orderCount = await prisma.order.count();
        const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;

        // Create blockchain initial entry
        const blockchainHistory = [
            {
                status: 'COTIZADO',
                timestamp: new Date().toISOString(),
                user: req.user.fullName,
                notes: `Convertido desde cotización ${quotation.quotationNumber}`,
            },
        ];

        const order = await prisma.order.create({
            data: {
                orderNumber,
                customerId: quotation.customerId,
                quotationId: quotation.id,
                totalAmount: quotation.totalAmount,
                currentStatus: 'COTIZADO',
                deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
                createdBy: req.user.id,
                blockchainHistory: JSON.stringify(blockchainHistory),
                items: {
                    create: quotation.items.map((item) => ({
                        resourceId: item.resourceId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        resource: true,
                    },
                },
                customer: true,
            },
        });

        // Update quotation status
        await prisma.quotation.update({
            where: { id },
            data: { status: 'CONVERTED' },
        });

        // Log event
        await prisma.eventLog.create({
            data: {
                eventType: 'VENTA',
                userId: req.user.id,
                quantity: quotation.totalAmount,
                details: {
                    action: 'quotation_converted',
                    quotationId: quotation.id,
                    orderId: order.id,
                },
            },
        });

        res.json(order);
    } catch (error) {
        console.error('Error converting quotation:', error);
        res.status(500).json({ error: 'Error al convertir cotización' });
    }
});

// @route   GET /api/quotations/:id
// @desc    Get quotation by ID
// @access  Private (Ejecutivo, Admin)
router.get('/:id', authenticateJWT, authorize('ADMIN', 'EJECUTIVO'), async (req: any, res) => {
    try {
        const { id } = req.params;

        const quotation = await prisma.quotation.findUnique({
            where: { id },
            include: {
                customer: true,
                items: {
                    include: {
                        resource: true,
                    },
                },
            },
        });

        if (!quotation) {
            return res.status(404).json({ error: 'Cotización no encontrada' });
        }

        res.json(quotation);
    } catch (error) {
        console.error('Error fetching quotation:', error);
        res.status(500).json({ error: 'Error al obtener cotización' });
    }
});

export default router;
