import prisma from './src/index.js';

const incidents = await prisma.incident.findMany({
    select: { id: true, openedAt: true, closedAt: true },
});
console.log('Incidents found:', incidents.length);
incidents.forEach(i => console.log(' -', i.id, 'openedAt:', i.openedAt, 'closedAt:', i.closedAt));

const result = await prisma.incident.deleteMany({});
console.log(`✓ Deleted ${result.count} incident(s).`);

await prisma.$disconnect();
