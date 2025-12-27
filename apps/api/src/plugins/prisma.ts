import fp from 'fastify-plugin';
import prisma from 'db';

export default fp((app)=>{

    app.decorate('prisma',prisma);
    app.addHook('onClose',async()=>{
        await prisma.$disconnect();
    });
})