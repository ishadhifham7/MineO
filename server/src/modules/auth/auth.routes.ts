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
                app.log.error({ err: error }, 'Signup failed');
                const statusCode = error?.message === 'User already exists' ? 409 : 500;
                return reply.status(statusCode).send({
                        message:
                            statusCode === 409
                                ? 'User already exists'
                                : 'Unable to signup right now. Please try again.',

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
                app.log.error({ err: error }, 'Login failed');
                const msg = error?.message || '';
                const isAuthError =
                    msg === 'Invalid email or password' || msg === 'Invalid credentials';

                return reply.status(isAuthError ? 401 : 500).send({
                        message: isAuthError
                            ? 'Invalid email or password'
                            : 'Unable to login right now. Please try again.',
        });
        }
        
    });
}