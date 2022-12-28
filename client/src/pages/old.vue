<script lang="ts">
import { authed } from '@construct/client/middleware/authed'
import { useTasks } from '@construct/client/stores/tasks'
import { isDefined, extract, TaskData, is, not } from '@construct/shared'
import { computed, defineComponent, onBeforeMount, reactive } from 'vue'

export default defineComponent({
	name: 'IndexPage',
	middleware: [authed],
})
</script>

<script setup lang="ts">
const tasks = useTasks()

const state = reactive({
	uuids: new Set<string>(),
	page: 0,
	limit: 10,
})

const items = computed(() =>
	Array.from(state.uuids).map(tasks.get).filter(isDefined),
)

async function list() {
	try {
		state.page++
		const params = extract(state, ['page', 'limit'])
		const items = await tasks.list(params)

		for (const item of items) state.uuids.add(item.uuid)
	} catch (error) {
		state.page--
		console.error('failed to list tasks', error)
	}
}

onBeforeMount(list)
</script>

<template>
	<ConstructPage class="index-page">
		<TaskList :items="items" />
		<TaskCreateForm @created="item => state.uuids.add(item.uuid)" />
	</ConstructPage>
</template>

<style lang="scss" scoped>
.index-page {
	@include flex(column);
	overflow: hidden;

	.task-list {
		flex: 1;

		overflow: hidden;
		overflow-y: auto;
	}
}
</style>
