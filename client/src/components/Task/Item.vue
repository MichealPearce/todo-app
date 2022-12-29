<script lang="ts">
import { useTasks } from '@construct/client/stores/tasks'
import { TaskData } from '@construct/shared'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'TaskItem',
})
</script>

<script setup lang="ts">
const tasks = useTasks()
const props = defineProps<{
	item: TaskData
}>()

const item = computed(() => props.item)
const complete = computed(() => item.value.complete)

async function toggleCompleteTask() {
	const task = item.value

	try {
		await tasks.update(task.uuid, { complete: !task.complete })
	} catch (error) {
		console.error('failed to update task', error)
	}
}
</script>

<template>
	<div
		class="task-item"
		:class="{ complete }"
	>
		<ConstructButton
			class="complete-btn"
			@click="toggleCompleteTask"
		>
			<i
				v-if="complete"
				class="fa-solid fa-circle-check"
			/>
			<i
				v-else
				class="fa-regular fa-circle"
			/>
		</ConstructButton>

		<div class="details">
			<h4 class="title">{{ item.title }}</h4>
		</div>

		<ConstructLink :to="`/projects/${item.project_uuid}/${item.uuid}`">
			<ConstructButton>
				<i class="fa-regular fa-circle-right"></i>
			</ConstructButton>
		</ConstructLink>
	</div>
</template>

<style lang="scss" scoped>
.task-item {
	@include flex(row, flex-start, center);
	width: 100%;
	padding: 1em;
	column-gap: 1em;

	background-color: lighten($color-background, 10%);
	border-radius: $border-radius;

	.complete-btn {
		width: 30px;
		height: 30px;
		padding: 0px;
		border-radius: 100%;
		font-size: 1em;

		background-color: $color-primary-text;
		color: $color-primary;
	}

	.details {
		flex: 1;
	}

	.construct-link {
		text-decoration: none;
	}

	&.complete .details {
		text-decoration: line-through;
		color: darken($color-text, 25%);
	}
}
</style>
