import '@but/config'
import prisma from 'db'
import { verifyGlobal } from './verifyGlobal'
import { verifyRegion } from './verifyRegion'

const REGION = ['IN', 'EU', 'US'];
console.log("Verifier Started......");

setInterval(async () => {
    const monitors = await prisma.monitor.findMany({
        where: { isActive: true }
    });
    for (const monitor of monitors) {
        for (const region of REGION) {
            await verifyRegion(monitor.id, region);
        }
        await verifyGlobal(monitor.id);
    }
}, 30_000);

// Cloud Run requires a listening port to consider the service healthy
import http from 'http';
http.createServer((_, res) => res.end('ok')).listen(process.env.PORT || 8080);