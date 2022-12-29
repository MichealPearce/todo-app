<script lang="ts">
import { ProjectData } from '@construct/shared'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProjectList',
})
</script>

<script setup lang="ts">
const props = defineProps<{
	items: ProjectData[]
}>()
</script>

<template>
	<div class="project-list">
		<ProjectItem
			v-for="item of items"
			:key="item.uuid"
			:item="item"
		/>
	</div>
</template>

<style lang="scss" scoped>
.project-list {
	@include flex(column);
	width: 100%;
	row-gap: 1em;
}
</style>
