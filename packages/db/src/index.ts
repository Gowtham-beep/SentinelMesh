import "@but/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const rawConnectionString = process.env.DATABASE_URL;
const connectionString = normalizeConnectionString(rawConnectionString);
const ssl = buildSslConfig(rawConnectionString);

function buildSslConfig(databaseUrl: string | undefined) {
  if (!databaseUrl) return undefined;

  const ca = process.env.DB_SSL_CA?.replace(/\\n/g, "\n");
  const forceInsecure = process.env.DB_SSL_INSECURE === "true";

  let sslmode = "";
  try {
    sslmode = new URL(databaseUrl).searchParams.get("sslmode") ?? "";
  } catch {
    if (ca) return { ca, rejectUnauthorized: true };
    if (forceInsecure) return { rejectUnauthorized: false };
    return undefined;
  }

  const requiresSsl = ["require", "verify-ca", "verify-full"].includes(
    sslmode.toLowerCase(),
  );

  if (!requiresSsl && !ca) return undefined;
  if (ca) return { ca, rejectUnauthorized: true };
  if (forceInsecure) return { rejectUnauthorized: false };

  // Compatibility fallback for managed DBs that use cert chains not trusted locally.
  console.warn(
    "[db] TLS fallback enabled (rejectUnauthorized=false). Set DB_SSL_CA to enable strict verification.",
  );
  return { rejectUnauthorized: false };
}

function normalizeConnectionString(databaseUrl: string | undefined) {
  if (!databaseUrl) return databaseUrl;

  try {
    const url = new URL(databaseUrl);
    for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert"]) {
      url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return databaseUrl;
  }
}

const pool = new Pool({ connectionString, ssl });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
export default prisma;
