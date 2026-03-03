import { FastifyInstance } from "fastify";
import "@fastify/jwt";
import { SignUpSchema, loginSchema, authMeSchema, updatePasswordSchema } from "./auth.schema.js";
import { signUpUser, logIn, getUserProfile, changePassword } from "./auth.service.js";
import { User } from "../../types/user.js";

export async function authRoutes(app: FastifyInstance) {
  app.post<{
    Body: { email: string; password: string };
    Reply: { accessToken: string; user: User };
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

      return reply.code(201).send({ user, accessToken });
    }
  );

  app.post<{
    Body: { email: string, password: string };
    Reply: { accessToken: string };
  }>(
    '/login',
    { schema: loginSchema },
    async (request, reply) => {
      const { email, password } = request.body;
      const accessToken = await logIn(app, email, password);
      return reply.code(201).send({ accessToken });
    }
  );


  app.register(async (protectedApp) => {
    
    protectedApp.addHook('onRequest', async (request) => {
      await request.jwtVerify();
    });

    protectedApp.get(
      '/me',
      { schema: authMeSchema },
      async (request, reply) => {
        const userId = request.user.sub;
        const profile = await getUserProfile(protectedApp, userId);
        return reply.code(200).send(profile);
      }
    );

    protectedApp.put<{
      Body: { currentPassword: string; newPassword: string };
    }>(
      '/password',
      { schema: updatePasswordSchema },
      async (request, reply) => {
        const userId = request.user.sub;
        const { currentPassword, newPassword } = request.body;

        await changePassword(protectedApp, userId, currentPassword, newPassword);
        return reply.code(200).send({ message: "Password updated successfully" });
      }
    );
  });
}
