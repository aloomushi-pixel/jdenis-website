import { PrismaClient } from '@prisma/client';
import config from '../../prisma/prisma.config';

const prisma = new PrismaClient(config);

export default prisma;
