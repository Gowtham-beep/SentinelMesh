import prisma from './packages/db/src/index';

import { getRecentResults } from './apps/verifier/src/result';

async function main() {
    const monitorId = "4e4b8940-474c-40d2-b765-7c634745935f";

    // Test IN region
    const resultIN = await getRecentResults(monitorId, 'IN', 2);
    console.log("IN", resultIN.map(r => r.status));

    // Test EU region
    const resultEU = await getRecentResults(monitorId, 'EU', 2);
    console.log("EU", resultEU.map(r => r.status));

    // Test US region
    const resultUS = await getRecentResults(monitorId, 'US', 2);
    console.log("US", resultUS.map(r => r.status));
}

main().catch(console.error).finally(() => prisma.$disconnect());
