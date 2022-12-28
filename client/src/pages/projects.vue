<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProjectsPage',
})
</script>

<script setup lang="ts"></script>

<template>
	<RouterView
		class="projects-page"
		v-slot="{ Component }"
	>
		<KeepAlive>
			<component :is="Component" />
		</KeepAlive>
	</RouterView>
</template>

<style lang="scss" scoped>
.projects-page {
}
</style>
