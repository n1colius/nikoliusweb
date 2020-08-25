<template>
    <div class="content has-text-centered">
        <p>
          Build with <strong>NuxtJS</strong>, <strong>Express</strong>, and <strong>Bulma UI</strong> &copy Nikolius {{ year }}
        </p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            year: new Date().getFullYear()
        }
    }
}
</script>
