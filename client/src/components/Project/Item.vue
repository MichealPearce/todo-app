<script lang="ts">
import { provideProject } from '@construct/client/stores/projects'
import { ProjectData } from '@construct/shared'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'ProjectItem',
})
</script>

<script setup lang="ts">
const props = defineProps<{
	item: ProjectData
}>()

const project = computed(() => props.item)

provideProject(project)
</script>

<template>
	<div class="project-item">
		<ProjectTitle level="4" />

		<ConstructLink :to="`/projects/${project.uuid}`">
			<ConstructButton>
				<i class="fa-regular fa-circle-right"></i>
			</ConstructButton>
		</ConstructLink>
	</div>
</template>

<style lang="scss" scoped>
.project-item {
	@include flex(row, space-between, center);
	width: 100%;
	padding: 1em;
	column-gap: 1em;

	background-color: lighten($color-background, 10%);
	border-radius: $border-radius;

	.construct-link {
		text-decoration: none;
	}
}
</style>
