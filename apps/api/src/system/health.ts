import  prisma  from 'db';

export async function healthCheck() {
    const startTime = Date.now();

    try {
        await prisma.$queryRaw`SELECT 1`;
        const latency = Date.now() - startTime;

        return {
            status: "ok",
            database:"connected",
            latency: `${latency}ms`,
            uptime:process.uptime(),
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        console.error(error);
        return {
            status: "error",
            database: "disconnected",
            error: (error as Error).message,
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        }
        
    }
}