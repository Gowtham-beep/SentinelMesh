import "@but/config";
import Fastify from "fastify";
import { healthCheck } from "./system/health";

//pligins

import jwtPlugin from "./plugins/jwt";
import prismaPlugin from "./plugins/prisma";
import authPlugin from "./plugins/auth";

//routes
import { authRoutes } from "./modules/auth/auth.route";

const server = Fastify({logger:true});

server.register(jwtPlugin);
server.register(prismaPlugin);
server.register(authPlugin);

server.register(authRoutes,{prefix:'/auth'});

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
