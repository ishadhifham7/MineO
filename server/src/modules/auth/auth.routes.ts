import { FastifyInstance } from 'fastify';
import { signupUser, loginUser } from './auth.service';

export async function authRoutes(app: FastifyInstance) {
  
    //  signup
    app.post('/signup', async (request, reply) => {

        try {
        const { name, email, password, dob } = request.body as any;

        const result = await signupUser({ name, email, password, dob });

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
        const { email, password } = request.body as any;

        const result = await loginUser(email, password);

        return reply.send(result);
        } catch (error: any) {
        return reply.status(401).send({
            message: error.message,
        });
        }
        
    });
}