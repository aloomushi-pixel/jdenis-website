import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all users (Admin only)
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get users by role (Admin only)
router.get('/by-role/:role', authenticate, authorize('ADMIN'), async (req, res) => {
    try {
        const { role } = req.params;
        const users = await prisma.user.findMany({
            where: { role: role as any },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                isActive: true,
            },
        });
        res.json(users);
    } catch (error) {
        console.error('Get users by role error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
