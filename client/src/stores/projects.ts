import { defineStore } from '@construct/client/includes/functions'
import { useTasks } from '@construct/client/stores/tasks'
import { ProjectData, TaskData } from '@construct/shared'
import { inject, InjectionKey, provide, reactive, Ref } from 'vue'

export type ProjectInjectionValue = Ref<ProjectData | undefined>

export const ProjectInjectionKey: InjectionKey<ProjectInjectionValue> = Symbol(
	'ProjectInjectionKey',
)

export const provideProject = (project: ProjectInjectionValue) =>
	provide(ProjectInjectionKey, project)

export const injectProject = () => inject(ProjectInjectionKey)!

export const useProjects = defineStore('projects', context => {
	const tasks = useTasks(context)
	const { api } = context

	const items = reactive<{
		[uuid: string]: ProjectData
	}>({})

	const get = (uuid: string): ProjectData | undefined => items[uuid]

	function set(data: ProjectData) {
		if (data.uuid in items) Object.assign(items[data.uuid], data)
		else items[data.uuid] = data

		return get(data.uuid)!
	}

	async function list(params?: Record<any, any>) {
		const items = await api
			.get<ProjectData[]>('projects', { params })
			.then(res => res.data)

		return items.map(set)
	}

	function fetch(uuid: string) {
		return api
			.get<ProjectData>(`projects/${uuid}`)
			.then(res => res.data)
			.then(set)
	}

	function create(data: Pick<ProjectData, 'title'>) {
		return api
			.post<ProjectData>('projects', data)
			.then(res => res.data)
			.then(set)
	}

	function update(uuid: string, data: Partial<ProjectData>) {
		return api
			.patch<ProjectData>(`projects/${uuid}`, data)
			.then(res => res.data)
			.then(set)
	}

	function remove(uuid: string) {
		return api.delete(`projects/${uuid}`).then(() => {
			delete items[uuid]
		})
	}

	function listTasks(uuid: string, params?: Record<any, any>) {
		return api
			.get<TaskData[]>(`projects/${uuid}/tasks`, { params })
			.then(res => res.data)
			.then(items => items.map(tasks.set))
	}

	return {
		items,
		get,
		set,
		list,
		fetch,
		create,
		update,
		remove,
		listTasks,
	}
})
