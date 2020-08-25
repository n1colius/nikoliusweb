<template>
  <div>
    <section class="hero is-fullheight is-default is-bold">
      <!-- Header -->
      <Header />

      <nuxt />

      <!-- Footer -->
      <Footer />
    </section>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default {
  components: {
    Header,
    Footer
  }
};
</script>

<style></style>