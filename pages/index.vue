<template>
	<div class="hero-body">
		<div class="container has-text-centered">
			<div class="columns is-vcentered">
				<div class="column is-5">
					<img
						id="ImgCover"
						src="/images/coverdepan.jpg"
						alt="Foto Nikolius"
					/>
				</div>
				<div class="column is-6 is-offset-1">
					<h1 class="title is-2">Halo, Saya Nikolius</h1>
					<h2 class="subtitle is-4">
						Saya seorang Web Developer. Ini adalah webpage personal
						saya
					</h2>
					<br />

					<h5>Anda bisa menemukan saya di</h5>
					<br />
					<div class="columns is-centered">
						<a class="logo-social" href="https://www.facebook.com/nikolius" title="Facebook" target="_blank"><img src="/images/fb.png"/></a>
						<a class="logo-social" title="Twitter" target="_blank" href="https://twitter.com/n1colius"><img src="/images/twitter.png"/></a>
						<a class="logo-social" target="_blank" title="LinkedIn" href="https://www.linkedin.com/in/niko-lius-3138475b/"><img src="/images/linkedin.png"/></a>
						<a class="logo-social" target="_blank" title="GitHub" href="https://github.com/n1colius"><img height="48" src="/images/github.png"/></a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	middleware: ["redirectwww"]
}
</script>

<style scoped>
.logo-social {
	margin-right: 15px;
}
</style>