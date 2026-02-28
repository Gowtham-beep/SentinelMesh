// Run from: node --experimental-vm-modules packages/db/delete-incidents.mjs
import '../../../packages/config/src/index.ts';
import prisma from './src/index.ts';

const incidents = await prisma.incident.findMany({
    select: { id: true, openedAt: true, resolvedAt: true }
});

console.log('Found incidents:', JSON.stringify(incidents, null, 2));

const result = await prisma.incident.deleteMany({});
console.log(`✓ Deleted ${result.count} incident(s).`);

await prisma.$disconnect();
process.exit(0);
