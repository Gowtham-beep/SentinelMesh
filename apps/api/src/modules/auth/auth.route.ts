import { FastifyInstance } from "fastify";
import "@fastify/jwt";
import { SignUpSchema,loginSchema} from "./auth.schema.js";
import { signUpUser,logIn } from "./auth.service.js";
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

      return reply.code(201).send({user,accessToken});
    }
  );

  app.post<{
    Body:{email:string,password:string};
    Reply:{accessToken:string};
  }>(
    '/login',
    {schema:loginSchema},
    async(request,reply)=>{
      const {email,password} = request.body;
      const accessToken = await logIn(app,email,password);
      return reply.code(201).send({accessToken});
    }
  )
}
