<script lang="ts">
import { useTasks } from '@construct/client/stores/tasks'
import { extract, is, isDefined, not, TaskData } from '@construct/shared'
import { computed, defineComponent, onBeforeMount, reactive } from 'vue'

export default defineComponent({
	name: 'TaskList',
})
</script>

<script setup lang="ts">
const props = defineProps<{
	items: TaskData[]
}>()

const isComplete = (item: TaskData) => is(item.complete)
const isNotComplete = (item: TaskData) => not(item.complete)

const taskItems = computed(() => ({
	incomplete: props.items.filter(isNotComplete),
	complete: props.items.filter(isComplete),
}))
</script>

<template>
	<div class="task-list">
		<TaskItem
			v-for="item in taskItems.incomplete"
			:key="item.uuid"
			:item="item"
		/>

		<h3>Completed</h3>

		<TaskItem
			v-for="item in taskItems.complete"
			:key="item.uuid"
			:item="item"
		/>
	</div>
</template>

<style lang="scss" scoped>
.task-list {
	@include flex(column);
	width: 100%;
	padding: 0.5em;
	row-gap: 0.5em;
}
</style>
