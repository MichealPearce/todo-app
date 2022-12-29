<script lang="ts">
import { injectProject, useProjects } from '@construct/client/stores/projects'
import { extract, TaskData } from '@construct/shared'
import { computed, defineComponent, onBeforeMount, reactive } from 'vue'

export default defineComponent({
	name: 'ProjectsSingleIndexPage',
})
</script>

<script setup lang="ts">
const projects = useProjects()
const project = injectProject()

const state = reactive<{
	tasks: Map<string, TaskData>
	page: number
	limit: number
}>({
	tasks: new Map(),
	page: 0,
	limit: 10,
})

async function listTasks() {
	const item = project.value
	if (!item) return

	try {
		state.page++
		const params = extract(state, ['page', 'limit'])
		const items = await projects.listTasks(item.uuid, params)

		for (const item of items) state.tasks.set(item.uuid, item)
	} catch (error) {
		state.page--
		console.error('failed listing project tasks', error)
	}
}

onBeforeMount(listTasks)
</script>

<template>
	<ConstructPage
		v-if="project"
		class="projects-single-index-page"
	>
		<h2 v-text="project.name" />

		<TaskList :items="Array.from(state.tasks.values())" />

		<TaskCreateForm @created="item => state.tasks.set(item.uuid, item)" />
	</ConstructPage>
</template>

<style lang="scss" scoped>
.projects-single-index-page {
	@include flex(column);

	h2 {
		padding: 0.5em;
	}

	.task-list {
		flex: 1;

		overflow: hidden;
		overflow-y: auto;
	}
}
</style>
