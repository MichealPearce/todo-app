import { Task } from '@construct/server/database/models/Task'
import { createRoute, Endpoint } from '@construct/server/includes/Endpoint'
import { defaults, extract, isNull, not, ServerError } from '@construct/shared'

export const tasksRoute = createRoute('/tasks')

@tasksRoute.endpoint('GET')
export class TasksListEndpoint extends Endpoint<{
	query: {
		page?: number
		limit?: number
	}
}> {
	get opts() {
		return defaults(this.request.query, {
			page: 1,
			limit: 10,
		})
	}

	async handle() {
		const opts = this.opts
		const skip = Math.max(0, (opts.page - 1) * opts.limit)
		const take = Math.max(1, opts.limit)
		const tasks = await Task.find({ skip, take })

		if (not(tasks.length)) throw new ServerError('page not found', 404)

		return tasks
	}
}

@tasksRoute.endpoint('POST')
export class TasksCreateEndpoint extends Endpoint<{
	body: {
		title: string
		project_uuid: string
		body?: string
		complete?: boolean
	}
}> {
	get data() {
		const body = extract(this.request.body, [
			'title',
			'body',
			'complete',
			'project_uuid',
		])

		return defaults(body, {
			complete: false,
		})
	}

	handle() {
		const data = this.data

		if (not(data.title)) throw new ServerError('title is required', 400)

		return Task.init(data).save()
	}
}

@tasksRoute.endpoint('GET', '/:uuid')
export class TasksGetEndpoint extends Endpoint<{
	params: {
		uuid: string
	}
}> {
	get uuid() {
		return this.request.params.uuid
	}

	async handle() {
		const uuid = this.uuid

		try {
			const task = Task.findOneBy({ uuid })

			if (not(task)) throw new ServerError('task not found', 404)
			return task
		} catch (error) {
			this.console.error(error, 'failed getting task')
			throw new ServerError('unexpected error', 500)
		}
	}
}

@tasksRoute.endpoint('PATCH', '/:uuid')
export class TasksUpdateEndpoint extends Endpoint<{
	params: { uuid: string }
	body: {
		title?: string
		body?: string
		complete?: boolean
	}
}> {
	get uuid() {
		return this.request.params.uuid
	}

	get data() {
		return extract(this.request.body, ['title', 'body', 'complete'])
	}

	async handle() {
		const uuid = this.uuid
		const data = this.data

		try {
			const task = await Task.findOneBy({ uuid })

			if (isNull(task)) throw new ServerError('task not found', 404)
			return task.assign(data).save()
		} catch (error) {
			this.console.error(error, 'failed updating task')
			throw new ServerError('unexpected error', 500)
		}
	}
}

@tasksRoute.endpoint('DELETE', '/:uuid')
export class TasksDeleteEndpoint extends Endpoint<{
	params: { uuid: string }
}> {
	get uuid() {
		return this.request.params.uuid
	}

	async handle() {
		try {
			const task = await Task.findOneBy({ uuid: this.uuid })

			if (isNull(task)) throw new ServerError('task not found', 404)

			await task.remove()
			return { success: true }
		} catch (error) {
			this.console.error(error, 'failed deleting task')
			throw new ServerError('unexpected error', 500)
		}
	}
}
