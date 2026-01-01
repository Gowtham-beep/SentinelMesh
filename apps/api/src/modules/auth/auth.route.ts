import { FastifyInstance } from "fastify";
import "@fastify/jwt";
import { SignUpSchema } from "./auth.schema";
import { signUpUser } from "./auth.service";
import { user } from "../../types/user";

export async function authRoutes(app: FastifyInstance) {
  app.post<{
    Body: { email: string; password: string };
    Reply: { accessToken: string; user: user };
  }>(
    '/signup',
    { schema: SignUpSchema },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await signUpUser(app, email, password);

      const accessToken = app.jwt.sign({
        sub: user.id,
        email: user.email,
      });

      return reply.code(201).send({user,accessToken});
    }
  );
}


    
