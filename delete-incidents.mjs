// delete-incidents.mjs — run once to remove bad incidents from the DB
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load .env from the repo root
require('dotenv').config({ path: '/home/gowtham-n/SentinelMesh/.env' });

const { PrismaClient } = await import('@prisma/client');
const { PrismaPg } = await import('@prisma/adapter-pg');
const { Pool } = await import('pg');

const rawUrl = process.env.DATABASE_URL;

// Strip sslmode from the connection string (the adapter handles SSL via pool options)
function normalizeUrl(url) {
    try {
        const u = new URL(url);
        for (const k of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert']) u.searchParams.delete(k);
        return u.toString();
    } catch { return url; }
}

const pool = new Pool({
    connectionString: normalizeUrl(rawUrl),
    ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

try {
    const incidents = await prisma.incident.findMany({ select: { id: true, openedAt: true, resolvedAt: true } });
    console.log('All incidents:', JSON.stringify(incidents, null, 2));

    // Delete all incidents (or filter if you want to keep specific ones)
    const result = await prisma.incident.deleteMany({});
    console.log(`Deleted ${result.count} incidents.`);
} finally {
    await prisma.$disconnect();
    await pool.end();
}
