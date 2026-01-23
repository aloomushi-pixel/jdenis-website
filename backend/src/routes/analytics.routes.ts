import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics summary  
// @access  Private (Admin, Ejecutivo)
router.get('/dashboard', authenticateJWT, async (req: any, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Resumen de ingreso de insumos (este mes)
        const rawMaterialIntake = await prisma.eventLog.aggregate({
            where: {
                eventType: 'INGRESO',
                timestamp: { gte: startOfMonth },
            },
            _sum: { quantity: true },
            _count: true,
        });

        // 2. Resumen de consumo en fábrica
        const factoryConsumption = await prisma.materialConsumption.aggregate({
            where: {
                recordedAt: { gte: startOfMonth },
            },
            _sum: { quantityUsed: true },
            _count: true,
        });

        // 3. Resumen de producto final  
        const finishedProductOutput = await prisma.productionOutput.aggregate({
            where: {
                recordedAt: { gte: startOfMonth },
            },
            _sum: { quantityProduced: true },
            _count: true,
        });

        // 4. Total de ventas por mes
        const monthlySales = await prisma.order.aggregate({
            where: {
                createdAt: { gte: startOfMonth },
                currentStatus: { notIn: ['CANCELADO'] },
            },
            _sum: { totalAmount: true },
            _count: true,
        });

        // 5. Total de compras por mes  
        const monthlyPurchases = await prisma.purchaseOrder.aggregate({
            where: {
                createdAt: { gte: startOfMonth },
                status: { notIn: ['CANCELLED'] },
            },
            _sum: { totalAmount: true },
            _count: true,
        });

        // 6. Eventos recientes (últimas 10 novedades)
        const recentEvents = await prisma.eventLog.findMany({
            take: 10,
            orderBy: { timestamp: 'desc' },
            include: {
                user: {
                    select: {
                        fullName: true,
                        role: true,
                    },
                },
                resource: {
                    select: {
                        title: true,
                        category: true,
                    },
                },
            },
        });

        res.json({
            rawMaterialIntake: {
                total: rawMaterialIntake._sum.quantity || 0,
                count: rawMaterialIntake._count,
            },
            factoryConsumption: {
                total: factoryConsumption._sum.quantityUsed || 0,
                count: factoryConsumption._count,
            },
            finishedProducts: {
                total: finishedProductOutput._sum.quantityProduced || 0,
                count: finishedProductOutput._count,
            },
            monthlySales: {
                total: monthlySales._sum.totalAmount || 0,
                count: monthlySales._count,
            },
            monthlyPurchases: {
                total: monthlyPurchases._sum.totalAmount || 0,
                count: monthlyPurchases._count,
            },
            recentEvents,
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Error al obtener analytics' });
    }
});

// @route   GET /api/analytics/charts
// @desc    Get chart data for dashboard
// @access  Private
router.get('/charts', authenticateJWT, async (req: any, res) => {
    try {
        const { period = '30d' } = req.query;

        let startDate = new Date();
        if (period === '7d') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (period === '30d') {
            startDate.setDate(startDate.getDate() - 30);
        } else if (period === '90d') {
            startDate.setDate(startDate.getDate() - 90);
        }

        // Get daily aggregates
        const events = await prisma.eventLog.findMany({
            where: {
                timestamp: { gte: startDate },
            },
            orderBy: { timestamp: 'asc' },
        });

        // Group by date and type
        const chartData: any = {};
        events.forEach((event) => {
            const date = event.timestamp.toISOString().split('T')[0];
            if (!chartData[date]) {
                chartData[date] = {
                    date,
                    COMPRA: 0,
                    VENTA: 0,
                    INGRESO: 0,
                    EGRESO: 0,
                    PRODUCCION: 0,
                };
            }
            chartData[date][event.eventType] += event.quantity || 1;
        });

        res.json(Object.values(chartData));
    } catch (error) {
        console.error('Error fetching chart data:', error);
        res.status(500).json({ error: 'Error al obtener datos de gráficas' });
    }
});

export default router;
