import dotenv from 'dotenv';
import path from 'node:path';
import Fastify from "fastify";
import { healthCheck } from "./system/health";

const envPath = path.resolve('../../.env');
console.log("Env path:", envPath);
dotenv.config({ path: envPath });

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const server = Fastify();

server.get("/health", healthCheck);

async function main(){
try {
    const port = Number(process.env.API_PORT) || 3000;
    await server.listen({
        port,
        host: '0.0.0.0'
    });
    console.log(`Server is ready at http://localhost:${port}`);
} catch (error) {
    console.error(error);
    process.exit(1);
}
}
main();
