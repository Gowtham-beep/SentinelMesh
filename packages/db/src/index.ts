import "@but/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const ssl = buildSslConfig(connectionString);

function buildSslConfig(databaseUrl: string | undefined) {
  if (!databaseUrl) return undefined;

  const ca = process.env.DB_SSL_CA?.replace(/\\n/g, "\n");

  let sslmode = "";
  try {
    sslmode = new URL(databaseUrl).searchParams.get("sslmode") ?? "";
  } catch {
    return ca ? { ca, rejectUnauthorized: true } : undefined;
  }

  const requiresSsl = ["require", "verify-ca", "verify-full"].includes(
    sslmode.toLowerCase(),
  );

  if (!requiresSsl && !ca) return undefined;
  if (ca) return { ca, rejectUnauthorized: true };

  // Compatibility fallback for managed DBs that use cert chains not trusted locally.
  console.warn(
    "[db] TLS fallback enabled (rejectUnauthorized=false). Set DB_SSL_CA to enable strict verification.",
  );
  return { rejectUnauthorized: false };
}

const pool = new Pool({ connectionString, ssl });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
export default prisma;
