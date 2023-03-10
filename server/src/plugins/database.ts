import { AppSession } from '@construct/server/database/models/AppSession'
import { Project } from '@construct/server/database/models/Project'
import { Task } from '@construct/server/database/models/Task'
import { User } from '@construct/server/database/models/User'
import { UserRole } from '@construct/server/database/models/UserRole'
import { hashPassword } from '@construct/server/includes/functions'
import { FastifyInstance } from 'fastify'
import { resolve } from 'path'
import { DataSource } from 'typeorm'

export async function registerDatabase(instance: FastifyInstance) {
	const source = new DataSource({
		type: 'sqlite',
		database: resolve(__BIN_ROOT__, 'database.sqlite'),
		entities: [User, UserRole, AppSession, Project, Task],
		synchronize: true,
		// logging: true,
	})

	try {
		instance.log.info('connecting to database...')
		await source.initialize()
		instance.log.info('connected to database')
	} catch (error) {
		instance.log.error(error, 'failed to connect to database')
	}

	instance.decorate('database', source)
	await setupRootUser()
}

async function setupRootUser() {
	console.info('checking for admin role')
	const adminRole = await UserRole.findOneByOrFail({
		name: 'admin',
	}).catch(() => {
		console.info('creating admin role')
		return UserRole.init({
			name: 'admin',
			display_name: 'Admin',
		}).save()
	})

	console.info('checking for root user')
	await User.findOneByOrFail({
		name: 'root',
	}).catch(async () => {
		console.info('creating root user')
		return User.init({
			name: 'root',
			display_name: '[ROOT]',
			email: 'root@localhost.com',
			password: await hashPassword('root'),
			roles: [adminRole],
		}).save()
	})
}
