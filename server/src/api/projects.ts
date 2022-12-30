import { Project } from '@construct/server/database/models/Project'
import { Task } from '@construct/server/database/models/Task'
import { createRoute, Endpoint } from '@construct/server/includes/Endpoint'
import { defaults, extract, isNull, not, ServerError } from '@construct/shared'

export const projectsRoute = createRoute('/projects')

@projectsRoute.endpoint('GET')
export class ProjectsListEndpoint extends Endpoint<{
	query: {
		page?: number
		limit?: number
	}
}> {
	get opts() {
		const query = extract(this.request.query, ['page', 'limit'])

		return defaults(query, {
			page: 0,
			limit: 10,
		})
	}

	async handle() {
		const opts = this.opts
		const skip = Math.max(0, (opts.page - 1) * opts.limit)
		const take = Math.max(1, opts.limit)
		const projects = await Project.find({ skip, take })

		if (not(projects.length)) throw new ServerError('page not found', 404)

		return projects
	}
}

@projectsRoute.endpoint('POST')
export class ProjectsCreateEndpoint extends Endpoint<{
	body: {
		title: string
	}
}> {
	get data() {
		return extract(this.request.body, ['title'])
	}

	handle() {
		return Project.init(this.data).save()
	}
}

@projectsRoute.endpoint('GET', '/:uuid')
export class ProjectsGetEndpoint extends Endpoint<{
	params: {
		uuid: string
	}
}> {
	get uuid() {
		return this.request.params.uuid
	}

	async handle() {
		const project = await Project.findOneBy({
			uuid: this.uuid,
		})

		if (isNull(project)) throw new ServerError('project not found', 404)

		return project
	}
}

@projectsRoute.endpoint('PATCH', '/:uuid')
export class ProjectsUpdateEndpoint extends Endpoint<{
	params: {
		uuid: string
	}
	body: {
		title?: string
	}
}> {
	get uuid() {
		return this.request.params.uuid
	}

	get data() {
		return extract(this.request.body, ['title'])
	}

	async handle() {
		const project = await Project.findOneBy({
			uuid: this.uuid,
		})

		if (isNull(project)) throw new ServerError('project not found', 404)

		return project.assign(this.data).save()
	}
}

@projectsRoute.endpoint('DELETE', '/:uuid')
export class ProjectsDeleteEndpoint extends Endpoint<{
	params: {
		uuid: string
	}
}> {
	get uuid() {
		return this.request.params.uuid
	}

	async handle() {
		const project = await Project.findOneBy({
			uuid: this.uuid,
		})

		if (isNull(project)) throw new ServerError('project not found', 404)

		return project.remove()
	}
}

@projectsRoute.endpoint('GET', '/:uuid/tasks')
export class ProjectsListTasksEndpoint extends Endpoint<{
	params: {
		uuid: string
	}
	query: {
		page?: number
		limit?: number
	}
}> {
	get uuid() {
		return this.request.params.uuid
	}

	get opts() {
		const query = extract(this.request.query, ['page', 'limit'])
		return defaults(query, {
			page: 0,
			limit: 10,
		})
	}

	async handle() {
		const project = await Project.findOneBy({
			uuid: this.uuid,
		})

		if (isNull(project)) throw new ServerError('project not found', 404)

		const opts = this.opts
		const skip = Math.max(0, (opts.page - 1) * opts.limit)
		const take = Math.max(1, opts.limit)

		const tasks = await Task.find({
			where: {
				project_uuid: project.uuid,
			},
			skip,
			take,
		})

		if (not(tasks.length)) throw new ServerError('page not found', 404)
		return tasks
	}
}
