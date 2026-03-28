import { FastifyInstance } from 'fastify';
import { signupUser, loginUser } from './auth.service';

export async function authRoutes(app: FastifyInstance) {
  //  signup
  app.post('/signup', async (request, reply) => {
    try {
      const { name, email, password, dob, bio, gender, country, profilePhoto } =
        request.body as any;

      // Validate required fields
      if (!name || !email || !password || !dob) {
        return reply.status(400).send({
          message: 'Name, email, password, and date of birth are required',
        });
      }

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

      // Generate JWT token for auto-login
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { userId: result.id, email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return reply.send({
        message: 'User created',
        userId: result.id,
        token, // Return token for auto-login
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
      const { email, password } = request.body as any;

      if (!email || !password) {
        return reply.status(400).send({
          message: 'Email and password are required',
        });
      }

      const result = await loginUser(email, password);

      return reply.send(result);
    } catch (error: any) {
      return reply.status(401).send({
        message: error.message,
      });
    }
  });
}
