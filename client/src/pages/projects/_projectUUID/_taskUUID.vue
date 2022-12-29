<script lang="ts">
import { provideTask, useTasks } from '@construct/client/stores/tasks'
import { TaskData } from '@construct/shared'
import { defineComponent, onBeforeMount, ref } from 'vue'

export default defineComponent({
	name: 'ProjectSingleTaskSinglePage',
})
</script>

<script setup lang="ts">
const tasks = useTasks()
const props = defineProps<{
	taskUUID: string
}>()

const item = ref<TaskData | undefined>()

async function fetchTask() {
	try {
		item.value = await tasks.fetch(props.taskUUID)
	} catch (error) {
		console.error('failed fetching task', error)
	}
}

onBeforeMount(fetchTask)

provideTask(item)
</script>

<template>
	<RouterView />
</template>

<style lang="scss" scoped>
.class-name {
}
</style>
