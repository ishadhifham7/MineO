import { FastifyInstance } from 'fastify';
import { signupUser, loginUser } from './auth.service';

export async function authRoutes(app: FastifyInstance) {
  //  signup
  app.post('/signup', async (request, reply) => {
    try {
      const { name, email, password, dob, bio, gender, country, profilePhoto } =
      request.body as any;

      const result = await signupUser({
        name,
        email,
        password,
        dob,
        bio,
        gender,
        country,
        profilePhoto,
      });

        return reply.send({
            message: 'User created',
            userId: result.id,

        });
        } catch (error: any) {
        return reply.status(400).send({
            message: error.message,

        });
        }

    });



  // login
  app.post('/login', async (request, reply) => {
    try {
      console.log('📥 Login request received:', request.body);
      const { email, password } = request.body as any;

      if (!email || !password) {
        console.log('❌ Missing email or password');
        return reply.status(400).send({
          message: 'Email and password are required',
        });
      }

      console.log('🔵 Calling loginUser service...');
      const result = await loginUser(email, password);
      console.log('✅ Login successful, sending response');

        return reply.send(result);
        } catch (error: any) {
        return reply.status(401).send({
            message: error.message,
        });
        }
        
    });
}
