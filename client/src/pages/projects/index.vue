<script lang="ts">
import { useProjects } from '@construct/client/stores/projects'
import { extract, isDefined } from '@construct/shared'
import { computed, defineComponent, onBeforeMount, reactive } from 'vue'

export default defineComponent({
	name: 'ProjectsIndexPage',
})
</script>

<script setup lang="ts">
const projects = useProjects()

const state = reactive<{
	uuids: Set<string>
	page: number
	limit: number
}>({
	uuids: new Set(),
	page: 0,
	limit: 10,
})

const items = computed(() =>
	Array.from(state.uuids).map(projects.get).filter(isDefined),
)

async function listProjects() {
	try {
		state.page++
		const params = extract(state, ['page', 'limit'])
		const items = await projects.list(params)

		for (const item of items) state.uuids.add(item.uuid)
	} catch (error) {
		state.page--
	}
}

onBeforeMount(listProjects)
</script>

<template>
	<ConstructPage class="projects-index-page">
		<header>
			<h2>Projects</h2>

			<ConstructLink to="/projects/create">
				<ConstructButton>Create</ConstructButton>
			</ConstructLink>
		</header>

		<div class="items">
			<div
				v-for="item of items"
				:key="item.uuid"
				class="item"
			>
				<h4 v-text="item.name" />

				<ConstructLink :to="`/projects/${item.uuid}`">
					<ConstructButton>View</ConstructButton>
				</ConstructLink>
			</div>
		</div>
	</ConstructPage>
</template>

<style lang="scss" scoped>
.projects-index-page {
	@include flex(column);
	padding: 0.5em;

	header {
		@include flex(row, space-between, center);
		width: 100%;

		margin-bottom: 1em;
		border-bottom: 1px solid white;
	}

	.items {
		@include flex(column);
		row-gap: 0.5em;
		width: 100%;

		.item {
			@include flex(row, space-between, center);
			width: 100%;
		}
	}
}
</style>
