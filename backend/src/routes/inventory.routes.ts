import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get global inventory (all locations)
router.get('/', authenticate, async (req, res) => {
    try {
        const inventory = await prisma.stock.findMany({
            include: {
                product: true,
                location: true,
            },
            orderBy: {
                lastUpdated: 'desc',
            },
        });
        res.json(inventory);
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get inventory by location
router.get('/location/:locationId', authenticate, async (req, res) => {
    try {
        const { locationId } = req.params;
        const inventory = await prisma.stock.findMany({
            where: { locationId: locationId as string },
            include: {
                product: true,
                location: true,
            },
        });
        res.json(inventory);
    } catch (error) {
        console.error('Get inventory by location error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get inventory locations
router.get('/locations', authenticate, async (req, res) => {
    try {
        const locations = await prisma.inventoryLocation.findMany({
            include: {
                stock: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        res.json(locations);
    } catch (error) {
        console.error('Get locations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get products
router.get('/products', authenticate, async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                stock: {
                    include: {
                        location: true,
                    },
                },
            },
        });
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update stock (internal use, called by other modules)
export async function updateStock(
    productId: string,
    locationId: string,
    quantityChange: number,
    userId: string,
    io: any
) {
    const stock = await prisma.stock.findUnique({
        where: {
            productId_locationId: {
                productId,
                locationId,
            },
        },
    });

    if (stock) {
        const updated = await prisma.stock.update({
            where: {
                productId_locationId: {
                    productId,
                    locationId,
                },
            },
            data: {
                quantity: stock.quantity + quantityChange,
                lastUpdated: new Date(),
                updatedBy: userId,
            },
            include: {
                product: true,
                location: true,
            },
        });

        // Emit real-time update via Socket.IO
        io.emit('inventory:update', updated);

        return updated;
    } else {
        const created = await prisma.stock.create({
            data: {
                productId,
                locationId,
                quantity: Math.max(0, quantityChange),
                updatedBy: userId,
            },
            include: {
                product: true,
                location: true,
            },
        });

        io.emit('inventory:update', created);

        return created;
    }
}

export default router;
