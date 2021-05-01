<template>
  <div class="main">
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import Footer from "~/components/Footer";

export default {
  data() {
    return {
      stat: [],
    };
  },
  components: {
    Footer,
  },
  async fetch() {
    this.stat = await this.$http.$get("/api/v1/stats");
  },
  fetchOnServer: true,
};
</script>
