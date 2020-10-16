<template>
	<div class="container pageblog">

        <div v-for="vBlog in Blog" :key="vBlog.BlogId">
            <section class="section">
                <div class="columns">
                    <div class="column is-8 is-offset-2">
                        <div class="content is-medium">
                        	<figure class="image is-2by1" v-if="vBlog.BlogHeadlinePic != null">
	                            <img v-bind:src="vBlog.BlogHeadlinePic">
	                        </figure>
                            <h2 class="subtitle is-4">{{ $moment(vBlog.BlogDate).format('MMMM DD, YYYY') }}</h2>
                            <nuxt-link :to="'/blog/'+vBlog.BlogId"><h1 class="title">{{ vBlog.BlogTitle }}</h1></nuxt-link>

							<div v-if="vBlog.Tags != null" class="field is-grouped is-grouped-multiline ContTags">
								<div class="control" v-for="tag in vBlog.Tags.split(',')" :key="tag">
									<div class="tags has-addons">
										<span class="tag is-primary">{{tag}}</span>
									</div>
								</div>
							</div>

                            <p class="ContentBlog" v-html="vBlog.BlogDesc"></p>
							<nuxt-link class="LinkBlog" :to="'/blog/'+vBlog.BlogId">Baca Lengkap</nuxt-link>
                        </div>
                    </div>
                </div>
            </section>
            <div class="is-divider"></div>
        </div>

		<section class="section has-text-centered" v-if="BlogDisplay < TotalBlog">
			<button @click.prevent="LoadMore()" class="button is-warning is-small">Load lagi ya ...</button>
		</section>

	</div>
</template>

<script>
export default {
	middleware: ["redirectwww"],
	data() {
		return {
			Blog: [],
			BlogCount: 4,
			TotalBlog: 0,
			BlogDisplay: 0
		};
	},
	async asyncData(context) {
		try {
			const response = await context.$axios.get("blogman/front", {
				params: {
					BlogCount: 4
				}
			});

			return {
				Blog: response.data.DataBlog,
				TotalBlog: response.data.TotalBlog,
				BlogDisplay: response.data.DataBlog.length
			};
		} catch (err) {
			console.log('err :>> ', err);
		}
	},
	methods: {
		async LoadMore() {
			try {
				this.BlogCount += 4;

				const response = await this.$axios.get("blogman/front", {
					params: {
						BlogCount: this.BlogCount
					}
				});

				this.Blog = response.data.DataBlog;
				this.BlogDisplay = response.data.DataBlog.length;
			} catch (err) {
				this.$toast.show(
					'<img src="/images/error.png" width="24" />&nbsp;&nbsp;<p>Sorry, Server is busy</p>',
					{
						type: "error"
					}
				);
			}	
		}
	}
};
</script>

<style scoped>
.subtitle {
	padding:0px 0px 5px 0px;
	margin:0px;
	font-size:0.75em;
}

.title {
	font-size:1.5em;
}

.ContentBlog {
	font-size:0.75em;
}

.LinkBlog {
	font-size:0.8em;
}

.ContTags {
	margin-top:-7px;
}
</style>