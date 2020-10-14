<template>
    <div class="columns">
        <div class="column">&nbsp;</div>
		<div class="column is-four-fifths">
			<h2 class="title">New Article Blog</h2>

            <!-- Form Begin -->
            <ValidationObserver v-slot="{ invalid }" ref="form">
            <form @submit.prevent="SubmitFormBlog(invalid)">

                <input type="hidden" v-model="FormBlogId" />

                <ValidationProvider rules="required" v-slot="{ errors, classes }">
                <div class="field">
                    <label class="label">Title</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Blog Title" v-model="FormBlogTitle">
                    </div>
                    <p class="help is-danger">
                        {{ errors[0] }}
                    </p>
                </div>
                </ValidationProvider>

                <div class="field">
                    <label class="label">Headline Picture</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="URL of the picture" v-model="FormBlogHeadlinePic">
                    </div>
                </div>

                <ValidationProvider rules="required" v-slot="{ errors, classes }">
                <div class="field">
                    <label class="label">Blog Date</label>
                    <div class="control">
                        <input class="input" type="date" v-model="FormBlogDate" />
                    </div>
                    <p class="help is-danger">
                        {{ errors[0] }}
                    </p>
                </div>
                </ValidationProvider>

                <ValidationProvider rules="required" v-slot="{ errors, classes }">
                <div class="field">
                    <label class="label">Tags</label>
                    <div class="control">
                        <label for="Opini" class="checkbox">
                            <input class="input-tags" type="checkbox" id="Opini" value="1" v-model="FormBlogTags"> Opini
                        </label>
                        <label for="Programming" class="checkbox">
                            <input class="input-tags" type="checkbox" id="Programming" value="2" v-model="FormBlogTags"> Programming
                        </label>
                        <label for="Database" class="checkbox">
                            <input class="input-tags" type="checkbox" id="Database" value="3" v-model="FormBlogTags"> Database
                        </label>
                        <label for="Macammacam" class="checkbox">
                            <input class="input-tags" type="checkbox" id="Macammacam" value="20" v-model="FormBlogTags"> Macam macam
                        </label>
                    </div>
                    <p class="help is-danger">
                        {{ errors[0] }}
                    </p>
                </div>
                </ValidationProvider>

                <div class="field">
                    <label class="label">Description</label>
                    <div class="control">
                        <div class="quill-editor" 
                            :content="FormBlogDesc"
                            @change="onEditorChangeDesc($event)"
                            v-quill:myQuillEditor="editorOption">
                        </div>
                    </div>
                    <p class="help is-danger">
                        {{ errors[0] }}
                    </p>
                </div>

                <div class="field">
                    <label class="label">Blog Content</label>
                    <div class="control">
                        <div class="quill-editor" 
                            :content="FormBlogArticle"
                            @change="onEditorChangeArticle($event)"
                            v-quill:myQuillEditorArticle="editorOption">
                        </div>
                    </div>
                    <p class="help is-danger">
                        {{ errors[0] }}
                    </p>
                </div>

                <br>
                <div class="field is-grouped">
                    <div class="control">
                        <button type="submit" class="button is-link">Submit</button>
                    </div>
                    <div class="control">
                        <button @click.prevent="BackToList()" class="button is-link is-light">Back</button>
                    </div>
                </div>
            </form>
            </ValidationObserver>
            <!-- Form End -->

        </div>
        <div class="column">&nbsp;</div>
    </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
    components: {
		ValidationProvider,
		ValidationObserver
	},
    middleware: 'authenticated',
    validate(context) {
        if(context.params.id == 'insert') {
            return true;
        } else if (Number.parseInt(context.params.id) > 0) {
            this.FormBlogId = context.params.id;
            return true;
        } else {
            return false;
        }
    },
    data() {
        return {
            errors: "",
		    classes: "",
            FormBlogId: "",
            FormBlogTitle: "",
            FormBlogHeadlinePic: "",
            FormBlogDate: "",
            FormBlogDesc: "",
            FormBlogArticle: "",
            FormBlogTags: [],
            editorOption: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block']
                    ]
                }
            }

        }
    },
    async mounted() {
        const BlogId = Number.parseInt(this.$route.params.id);
        if (BlogId > 0) {
            //Isi variable formnya
            let response = await this.$axios.get("blogman/form/"+BlogId);
            if(response.data.success == true) {
                this.FormBlogId = response.data.DataForm.BlogId;
                this.FormBlogTitle = response.data.DataForm.BlogTitle;
                this.FormBlogHeadlinePic = response.data.DataForm.BlogHeadlinePic;
                this.FormBlogDate = this.$moment(response.data.DataForm.BlogDate).format('YYYY-MM-DD');
                this.FormBlogDesc = response.data.DataForm.BlogDesc;
                this.FormBlogArticle = response.data.DataForm.BlogArticle;
                if(response.data.DataForm.BlogTags != null) this.FormBlogTags = response.data.DataForm.BlogTags.split(',');
            }
        }
    },
    methods: {
        onEditorChangeDesc({ editor, html, text }) {
            this.FormBlogDesc = html;
        },
        onEditorChangeArticle({ editor, html, text }) {
            this.FormBlogArticle = html;
        },
        async SubmitFormBlog(invalid) {
            //trigger validation
            const valid = await this.$refs.form.validate();

            if(invalid == false) {
                try {
                    let response = await this.$axios.post("blogman/isi", {
						FormBlogId: this.FormBlogId,
						FormBlogTitle: this.FormBlogTitle,
						FormBlogHeadlinePic: this.FormBlogHeadlinePic,
						FormBlogDate: this.FormBlogDate,
						FormBlogDesc: this.FormBlogDesc,
						FormBlogArticle: this.FormBlogArticle,
						FormBlogTags: this.FormBlogTags
                    });
                    
                    if (response.data.success == false) {
						this.$toast.show(
							'<img src="/images/info.png" width="24" />&nbsp;&nbsp;<p>' +
								response.data.message +
								"</p>",
							{
								type: "info"
							}
						);
					} else {
                        this.$toast.success(
							'<img src="/images/tick.png" width="24" />&nbsp;&nbsp;<p>Data Saved</p>',
							{
								type: "success"
							}
						);
						this.$router.push("/admin/blogman"); //balik ke home
                    }

                } catch (err) {
                    this.$toast.show(
						'<img src="/images/error.png" width="24" />&nbsp;&nbsp;<p>Sorry, Server is busy</p>',
						{
							type: "error"
						}
					);
                }
            } else {
                this.$toast.show(
					'<img src="/images/info.png" width="24" />&nbsp;&nbsp;<p>Form is not valid yet</p>',
					{
						type: "info"
					}
				);    
            }
        },
        BackToList() {
            this.$router.push("/admin/blogman");
        }
    }
}
</script>

<style scoped>
.quill-editor {
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
}
</style>