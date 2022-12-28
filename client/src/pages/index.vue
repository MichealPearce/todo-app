<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'IndexPage',
})
</script>

<script setup lang="ts">
const router = useRouter()

onBeforeMount(() => router.push('/projects'))
</script>

<template>
	<ConstructPage class="index-page">not redirected?</ConstructPage>
</template>

<style lang="scss" scoped>
.index-page {
}
</style>
