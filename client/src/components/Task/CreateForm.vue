<script lang="ts">
import { injectProject } from '@construct/client/stores/projects'
import { useTasks } from '@construct/client/stores/tasks'
import { TaskData } from '@construct/shared'
import { defineComponent, reactive } from 'vue'

export default defineComponent({
	name: 'TaskCreateForm',
})
</script>

<script setup lang="ts">
const project = injectProject()
const tasks = useTasks()

const emit = defineEmits<{
	(event: 'created', data: TaskData): void
}>()

const data = reactive({
	title: '',
})

async function create() {
	const taskProject = project.value
	if (!taskProject) return

	try {
		const created = await tasks.create({
			...data,
			project_uuid: taskProject.uuid,
		})
		emit('created', created)
		data.title = ''
	} catch (error) {
		console.error('failed to create task', error)
	}
}
</script>

<template>
	<form
		class="task-create-form"
		@submit.prevent="create"
	>
		<ConstructInput
			v-model="data.title"
			placeholder="Task Title..."
			required
		/>
		<ConstructButton type="submit">Create Task</ConstructButton>
	</form>
</template>

<style lang="scss" scoped>
.task-create-form {
	@include flex(row);
	width: 100%;

	.construct-input,
	.construct-button {
		height: 100%;
		border-radius: 0px;
	}

	.construct-input {
		flex: 1;

		& > :deep(input) {
			border-radius: 0px;
		}
	}
}
</style>
