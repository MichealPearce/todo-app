import { defineStore } from '@construct/client/includes/functions'
import { TaskData } from '@construct/shared'
import { inject, InjectionKey, provide, reactive, Ref } from 'vue'

export type TaskInjectionValue = Ref<TaskData | undefined>

export const TaskInjectionKey: InjectionKey<TaskInjectionValue> = Symbol('task')

export const provideTask = (task: TaskInjectionValue) =>
	provide(TaskInjectionKey, task)
export const injectTask = () => inject(TaskInjectionKey)!

export const useTasks = defineStore('tasks', context => {
	const { api } = context

	const items = reactive<{
		[uuid: string]: TaskData
	}>({})

	function get(uuid: string): TaskData | undefined {
		return items[uuid]
	}

	function set(data: TaskData) {
		if (data.uuid in items) Object.assign(items[data.uuid], data)
		else items[data.uuid] = data

		return items[data.uuid]
	}

	async function list(params?: Record<any, any>) {
		const items = await api
			.get<TaskData[]>('tasks', { params })
			.then(res => res.data)

		for (const item of items) set(item)
		return items
	}

	function fetch(uuid: string) {
		return api
			.get(`tasks/${uuid}`)
			.then(res => res.data)
			.then(set)
	}

	function create(data: Pick<TaskData, 'title' | 'body' | 'project_uuid'>) {
		return api
			.post<TaskData>('tasks', data)
			.then(res => res.data)
			.then(set)
	}

	function update(uuid: string, data: Partial<TaskData>) {
		return api
			.patch<TaskData>(`tasks/${uuid}`, data)
			.then(res => res.data)
			.then(set)
	}

	return {
		items,
		get,
		set,
		fetch,
		list,
		create,
		update,
	}
})
