import "@but/config";
import Fastify from "fastify";
import { healthCheck } from "./system/health";

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
