import { FastifyPluginAsync } from "fastify";
import { AuthenticatedRequest } from "../../plugins/auth.plugin"; 
import { getMyProfile, patchMyProfile } from "./user.service";
import { UpdateUserProfileBody } from "./user.types";

const userRoutes: FastifyPluginAsync = async (fastify) => {

    
  fastify.get(
    "/me",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const uid = (request as AuthenticatedRequest).user?.uid;
      if (!uid) return reply.status(401).send({ error: "Unauthorized" });

      try {
        const profile = await getMyProfile(fastify, uid);
        return reply.send({ profile });
      } catch (e: any) {
        if (e?.message === "PROFILE_NOT_FOUND") {
          return reply.status(404).send({ error: "Profile not found" });
        }
        request.log.error(e);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );



  fastify.patch(
    "/me",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const uid = (request as AuthenticatedRequest).user?.uid;
      if (!uid) return reply.status(401).send({ error: "Unauthorized" });

      const body = request.body as UpdateUserProfileBody;

      try {
        const profile = await patchMyProfile(fastify, uid, body);
        return reply.send({ profile });
      } catch (e: any) {
        if (e?.message === "PROFILE_NOT_FOUND") {
          return reply.status(404).send({ error: "Profile not found" });
        }
        request.log.error(e);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
};



export default userRoutes;