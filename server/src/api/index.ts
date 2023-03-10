import { authRoute } from '@construct/server/api/auth'
import { projectsRoute } from '@construct/server/api/projects'
import { tasksRoute } from '@construct/server/api/tasks'
import { userRolesRoute } from '@construct/server/api/userRoles'
import { usersRoute } from '@construct/server/api/users'
import { SessionStore } from '@construct/server/includes/SessionStore'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import { FastifyInstance } from 'fastify'

export async function registerAPI(instance: FastifyInstance) {
	await instance
		.register(fastifyCookie)
		.register(fastifySession, {
			secret: import.meta.env.SERVER_SESSION_SECRET,
			cookieName: 'construct-session',
			cookie: {
				httpOnly: true,
				secure: import.meta.env.PROD,
			},
			store: new SessionStore(),
		})
		.register(authRoute.register)
		.register(usersRoute.register)
		.register(userRolesRoute.register)
		.register(tasksRoute.register)
		.register(projectsRoute.register)
}
