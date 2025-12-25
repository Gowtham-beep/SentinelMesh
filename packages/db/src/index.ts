import dotenv from 'dotenv';
import path from 'node:path';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

dotenv.config({ path: path.resolve('../../.env') });

const connectionString = process.env.DATABASE_URL;


const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
export default prisma;
