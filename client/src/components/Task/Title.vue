<script lang="ts">
import { injectTask } from '@construct/client/stores/tasks'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'TaskTitle',
})
</script>

<script setup lang="ts">
const task = injectTask()
const props = withDefaults(
	defineProps<{
		level?: '1' | '2' | '3' | '4' | '5' | '6'
	}>(),
	{
		level: '1',
	},
)

const level = computed(() => `h${props.level}`)
</script>

<template>
	<component
		:is="level"
		v-if="task"
		class="task-title"
		v-text="task.title"
	/>
</template>

<style lang="scss" scoped>
.task-title {
}
</style>
