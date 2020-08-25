<template>
	<section class="hero">
		<div class="hero-body has-text-centered">
			<div class="column is-4 is-offset-4 register">
				<div class="columns">
					<div class="column right has-text-centered">
						<h2 class="title is-5">Admin Login</h2>

						<ValidationObserver v-slot="{ invalid }">
							<form @submit.prevent="SubmitFormLogin(invalid)">
								<ValidationProvider rules="required|email" v-slot="{ errors, classes }">
									<div class="field">
										<div class="control has-icons-left">
											<input
												:class="classes"
												class="input"
												type="email"
												placeholder="Email Address"
												v-model="EmailLogin"
											/>
											<span class="icon is-small is-left">
												<font-awesome-icon
													:icon="['fas', 'envelope']"
												/>
											</span>
										</div>
										<p class="help is-danger">
											{{ errors[0] }}
										</p>
									</div>
								</ValidationProvider>
								<br />

								<ValidationProvider rules="required" v-slot="{ errors, classes }">
									<div class="field">
										<div class="control has-icons-left">
											<input
												:class="classes"
												class="input"
												type="password"
												placeholder="Password"
												v-model="PasswordLogin"
											/>
											<span class="icon is-small is-left">
												<font-awesome-icon
													:icon="['fas', 'key']"
												/>
											</span>
										</div>
										<p class="help is-danger">
											{{ errors[0] }}
										</p>
									</div>
								</ValidationProvider>
								<br />

								<button type="submit" class="button is-block is-primary is-fullwidth is-medium">
									Login
								</button>
							</form>

						</ValidationObserver>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
	components: {
		ValidationProvider,
		ValidationObserver
	},
	data: () => ({
		errors: "",
		classes: "",
		EmailLogin: "",
		PasswordLogin: ""
	}),
	methods: {
		async SubmitFormLogin(invalid) {
			/*this.$toast.success('<img src="/images/tick.png" width="24" />&nbsp;&nbsp;<ul><li>Point 1</li><li>Point 2</li><li>Point 1</li><li>Point 2</li><li>Point 1</li><li>Point 2</li></ul>',{
				type:'success'
			});
			this.$toast.show('<img src="/images/info.png" width="24" />&nbsp;&nbsp;<ul><li>Point 1</li><li>Point 2</li></ul>',{
				type:'info'
			});
			this.$toast.show('<img src="/images/error.png" width="24" />&nbsp;&nbsp;<ul><li>Point 1</li><li>Point 2</li></ul>',{
				type:'error'
			});
			this.$router.push('portfolio');*/

			if (invalid == false) {
				try {
					let response = await this.$axios.post("authen", {
						EmailLogin: this.EmailLogin,
						PasswordLogin: this.PasswordLogin
					});
					//console.log(response);

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
						//console.log(response.data);

						//Success Login2
						const payload = {
							UserToken: response.data.DataReturn.Token,
							UserId: response.data.DataReturn.UserId,
							UserEmail: response.data.DataReturn.UserEmail,
							UserFullname: response.data.DataReturn.UserFullname
						};

						this.$store.dispatch("authen/SetLogin", payload);
						this.$toast.success(
							'<img src="/images/tick.png" width="24" />&nbsp;&nbsp;<p>Login Successfully</p>',
							{
								type: "success"
							}
						);

						//Set Default Header token
						//this.$axios.setToken(response.data.DataReturn.Token, 'Bearer');
						this.$router.push("/"); //balik ke home
					}
				} catch (error) {
					this.$toast.show(
						'<img src="/images/error.png" width="24" />&nbsp;&nbsp;<p>Sorry, Server is busy</p>',
						{
							type: "error"
						}
					);
				}
			}
		}
	}
};
</script>

<style scoped></style>