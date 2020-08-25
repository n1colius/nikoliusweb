<template>
	<div class="columns is-centered is-vcentered fullpage-error">
		<div class="column is-3"></div>
		<div class="column is-3">
			<h2 class="title">Sorry, Something Wrong</h2>
			<nuxt-link class="button is-primary is-rounded" to="/">Back to Homepage</nuxt-link>
		</div>
		<div class="column is-3">
			<img src="/images/errorpage.png" alt="Error Page" />
		</div>
		<div class="column is-3"></div>
    </div>
</template>

<script>
export default {
	layout: 'fullpage'
}
</script>

<style scoped>
.fullpage-error {
	margin-top:130px;
}
</style>