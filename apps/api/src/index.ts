import "@but/config";
import Fastify from "fastify";
import { healthCheck } from "./system/health.js";

//plugins

import jwtPlugin from "./plugins/jwt.js";
import prismaPlugin from "./plugins/prisma.js";
import authPlugin from "./plugins/auth.js";

//routes
import { authRoutes } from "./modules/auth/auth.route.js";
import { monitorRoutes } from "./modules/monitor/monitor.route.js";

const server = Fastify({logger:true});

server.register(jwtPlugin);
server.register(prismaPlugin);

server.register(authRoutes,{prefix:'/auth'});

server.register(async (protectedApp) => {
  protectedApp.register(authPlugin);
  protectedApp.register(monitorRoutes, { prefix: '/monitors' });

});

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
