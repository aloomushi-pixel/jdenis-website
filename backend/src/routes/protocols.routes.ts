import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all protocol templates
router.get('/templates', authenticate, async (req, res) => {
    try {
        const templates = await prisma.protocolTemplate.findMany({
            where: { isActive: true },
            orderBy: {
                name: 'asc',
            },
        });
        res.json(templates);
    } catch (error) {
        console.error('Get protocol templates error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get protocol templates by type
router.get('/templates/type/:type', authenticate, async (req, res) => {
    try {
        const { type } = req.params;
        const templates = await prisma.protocolTemplate.findMany({
            where: {
                type: type as any,
                isActive: true,
            },
        });
        res.json(templates);
    } catch (error) {
        console.error('Get protocol templates by type error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start protocol execution
router.post('/execute', authenticate, authorize('FACTORY_MANAGER', 'WAREHOUSE_MANAGER'), async (req: AuthRequest, res) => {
    try {
        const { templateId } = req.body;

        const template = await prisma.protocolTemplate.findUnique({
            where: { id: templateId },
        });

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        const execution = await prisma.protocolExecution.create({
            data: {
                templateId,
                executedBy: req.user!.userId,
                status: 'IN_PROGRESS',
                stepsData: JSON.stringify([]), // Will be filled as steps are completed
            },
            include: {
                template: true,
                executor: {
                    select: {
                        fullName: true,
                    },
                },
            },
        });

        res.status(201).json(execution);
    } catch (error) {
        console.error('Start protocol execution error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update protocol execution (complete steps)
router.patch('/execute/:id', authenticate, authorize('FACTORY_MANAGER', 'WAREHOUSE_MANAGER'), async (req, res) => {
    try {
        const { id } = req.params;
        const { stepsData, status } = req.body;

        const execution = await prisma.protocolExecution.update({
            where: { id },
            data: {
                stepsData: JSON.stringify(stepsData),
                status,
                completedAt: status === 'COMPLETED' ? new Date() : undefined,
            },
            include: {
                template: true,
            },
        });

        res.json(execution);
    } catch (error) {
        console.error('Update protocol execution error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get protocol execution history
router.get('/executions', authenticate, authorize('ADMIN', 'FACTORY_MANAGER', 'WAREHOUSE_MANAGER'), async (req, res) => {
    try {
        const executions = await prisma.protocolExecution.findMany({
            include: {
                template: true,
                executor: {
                    select: {
                        fullName: true,
                    },
                },
            },
            orderBy: {
                startedAt: 'desc',
            },
            take: 50,
        });
        res.json(executions);
    } catch (error) {
        console.error('Get protocol executions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
