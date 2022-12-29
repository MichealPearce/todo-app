<script lang="ts">
import { injectProject } from '@construct/client/stores/projects'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'ProjectTitle',
})
</script>

<script setup lang="ts">
const project = injectProject()
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
		v-if="project"
		class="project-title"
		v-text="project.title"
	/>
</template>

<style lang="scss" scoped>
.project-title {
}
</style>
