import Fastify from "fastify";
import dotenv from 'dotenv';
import { healthCheck } from "./system/health";
dotenv.config();


const server = Fastify();

server.get("/health", healthCheck);

async function main(){
try {
    const port = Number(process.env.PORT) || 3000;
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
