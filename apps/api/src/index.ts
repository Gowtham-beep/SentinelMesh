import Fastify from 'fastify'

const app = Fastify();

const unused = 123;

app.get("/health",async()=>{
    return {status:"OK"}
});

app.listen({port:3001},()=>{
    console.log("API running on http://localhost:3001",);
    
});
