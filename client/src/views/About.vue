<template>
  <div class="about">
    <h1>This is an about page</h1>
    <a href="/login" @click="logout">logout</a>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>
