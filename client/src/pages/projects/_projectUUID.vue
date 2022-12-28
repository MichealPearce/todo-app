<script lang="ts">
import { provideProject, useProjects } from '@construct/client/stores/projects'
import { computed, defineComponent, onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
	name: 'ProjectsSinglePage',
})
</script>

<script setup lang="ts">
const projects = useProjects()
const props = defineProps<{
	projectUUID: string
}>()

const project = computed(() => projects.get(props.projectUUID))

async function fetchProject() {
	console.log(props.projectUUID)
	try {
		await projects.fetch(props.projectUUID)
	} catch (error) {
		console.error('failed to fetch project', error)
	}
}

provideProject(project)
onBeforeMount(fetchProject)
</script>

<template>
	<RouterView
		v-if="project"
		:key="props.projectUUID"
		class="projects-single-page"
		v-slot="{ Component }"
	>
		<KeepAlive>
			<component :is="Component" />
		</KeepAlive>
	</RouterView>
</template>

<style lang="scss" scoped></style>
