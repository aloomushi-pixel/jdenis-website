import type { PrismaClientOptions } from '@prisma/client/runtime/library'

const config: PrismaClientOptions = {
    datasourceUrl: process.env.DATABASE_URL,
}

export default config
