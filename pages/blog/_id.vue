<template>
	<div class="container pageblog">
    	
		<section class="section">
			<div class="columns">
				<div class="column is-8 is-offset-2">
					<div class="content is-medium">

						<figure class="image is-2by1" v-if="BlogHeadlinePic != null">
							<img v-bind:src="BlogHeadlinePic">
						</figure>
						<h2 class="subtitle is-4">{{ $moment(BlogDate).format('MMMM DD, YYYY') }}</h2>
						<h1 class="title">{{ BlogTitle }}</h1>

						<div v-if="Tags != null" class="field is-grouped is-grouped-multiline ContTags">
							<div class="control" v-for="tag in Tags.split(',')" :key="tag">
								<div class="tags has-addons">
									<span class="tag is-primary">{{ tag }}</span>
								</div>
							</div>
						</div>

						<div class="ContShareSocMed"> Share on &nbsp;
							<ShareNetwork
								network="facebook"
								:url="BlogUrl"
								:title="BlogTitle"
							>
								<img width="24" src="/images/fb.png">
							</ShareNetwork>
							<ShareNetwork
								network="twitter"
								:url="BlogUrl"
								:title="BlogTitle"
							>
								<img width="24" src="/images/twitter.png">
							</ShareNetwork>
						</div>

						<hr>
						<p class="ContentBlog" v-html="BlogArticle"></p>

						<div class="comments">
							<Disqus />
						</div>

					</div>
				</div>
			</div>
		</section>

	</div>
</template>

<script>
export default {
	middleware: ["redirectwww"],
	validate(context) {
        if (Number.parseInt(context.params.id) > 0) {
            return true;
        } else {
            return false;
        }
    },
	data() {
		return {
			BlogId: null,
			BlogHeadlinePic: null,
			BlogDate: null,
			BlogTitle: "",
			Tags: null,
			BlogArticle: null,
			BlogUrl: ""
		};
	},
	async mounted() {
        const BlogId = Number.parseInt(this.$route.params.id);
        if (BlogId > 0) {
			let response = await this.$axios.get("blogman/front/"+BlogId);
            if(response.data.success == true) {
                this.BlogId = response.data.DataForm.BlogId;
                this.BlogTitle = response.data.DataForm.BlogTitle;
                this.BlogHeadlinePic = response.data.DataForm.BlogHeadlinePic;
                this.BlogDate = this.$moment(response.data.DataForm.BlogDate).format('YYYY-MM-DD');
                this.BlogDesc = response.data.DataForm.BlogDesc;
				this.BlogArticle = response.data.DataForm.BlogArticle;
				if(response.data.DataForm.BlogTags != null) this.Tags = response.data.DataForm.BlogTags;
				this.BlogUrl = process.env.BASE_URL+'/blog/'+response.data.DataForm.BlogId;
            }
		}
	}
}
</script>

<style scoped>
.subtitle {
	padding:0px 0px 5px 0px;
	margin:0px;
	font-size:0.75em;
}

.title {
	font-size:1.5em;
	margin-top:-0.15em !important;
}

.ContentBlog {
	font-size:0.75em;
}

.LinkBlog {
	font-size:0.8em;
}

.ContTags {
	margin-top:-7px;
	margin-bottom:1.25em !important;
}
.ContShareSocMed {
	font-size: 0.75em;
}
</style>