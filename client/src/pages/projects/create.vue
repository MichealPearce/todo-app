<script lang="ts">
import { useProjects } from '@construct/client/stores/projects'
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'ProjectsCreatePage',
})
</script>

<script setup lang="ts">
const router = useRouter()
const projects = useProjects()

const data = reactive({
	name: '',
})

async function createProject() {
	try {
		const item = await projects.create(data)
		router.push(`/projects/${item.uuid}`)
	} catch (error) {
		console.error('failed to create project', error)
	}
}
</script>

<template>
	<ConstructPage class="projects-create-page">
		<h2>Create Project</h2>

		<form @submit.prevent="createProject">
			<ConstructInput
				v-model="data.name"
				placeholder="Project Name..."
			/>

			<ConstructButton type="submit">Create</ConstructButton>
		</form>
	</ConstructPage>
</template>

<style lang="scss" scoped>
.projects-create-page {
	@include flex(column);

	h2 {
		margin-bottom: 1em;
	}

	form {
		@include flex(column);
		width: 100%;
		row-gap: 1em;

		& > * {
			width: 100%;
		}
	}
}
</style>
