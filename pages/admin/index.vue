<template>
  <HeaderMini />
</template>

<script>
export default {
  middleware: 'auth',
  beforeMount() {
    this.$router.push("admin/users");
  },
};
</script>