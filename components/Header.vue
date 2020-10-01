<template>
    <div class="hero-head">
        <nav class="navbar">
            <div class="container">
                <div class="navbar-brand">
                    <nuxt-link class="navbar-item" to="/">
                        <img src="/images/logoniko.png" alt="Logo" />
                    </nuxt-link>
                    <span class="navbar-burger burger" data-target="navbarMenu">
                        <span /><span /><span />
                    </span>
                </div>

                <div id="navbarMenu" class="navbar-menu">
                    <div class="navbar-end">
                        <nuxt-link to="/" class="navbar-item is-active">Home</nuxt-link>
                        <nuxt-link to="/portfolio" class="navbar-item">Portfolio</nuxt-link>
                        <nuxt-link to="/" class="navbar-item">Blog</nuxt-link>
                        <nuxt-link to="/cobacoba" class="navbar-item">Coba</nuxt-link>

                        <template v-if="IsLogin">
                            
                            <div class="navbar-item has-dropdown is-hoverable">
                                <a class="navbar-link">Admin Menu</a>
                                <div class="navbar-dropdown">
                                    <nuxt-link class="navbar-item" to="/admin/blogman">Blog</nuxt-link>
                                </div>
                            </div>
                            <a @click.prevent="ClickLogout()" href="#" class="navbar-item">Logout</a>
                        </template>
                        <template v-else>
                            <nuxt-link to="/login" class="navbar-item">Login</nuxt-link>
                        </template>
                        <!--<div class="navbar-item has-dropdown is-hoverable">
                            <a class="navbar-link">Account</a>
                            <div class="navbar-dropdown">
                                <a class="navbar-item">Dashboard</a>
                                <a class="navbar-item">Profile</a>
                                <a class="navbar-item">Settings</a>
                                <hr class="navbar-divider">
                                <div class="navbar-item">Logout</div>
                            </div>
                        </div>-->
                    </div>
                </div>

            </div>
        </nav>
        <hr class="HeaderSeparator">

        <!-- Script click menu burger -->
        <script>
        (function() {
            var burger = document.querySelector('.burger');
            var menu = document.querySelector('#'+burger.dataset.target);
            burger.addEventListener('click', function() {
                burger.classList.toggle('is-active');
                menu.classList.toggle('is-active');
            });
        })();
        </script>
    </div>
</template>

<script>
export default {
    computed: {
        IsLogin() {
            return this.$store.state.authen.IsLogin;
        }
    },
    methods: {
        ClickLogout() {
            this.$store.dispatch("authen/SetLogout");
            this.$router.push("/"); //balik ke home
		}
    }
}
</script>

<style scoped>
.HeaderSeparator {
    margin-top:0px;
}
</style>