<template>
  <div class="login-container">
    <div class="title-page">Twitter Clone</div>
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm.vue";

export default {
  name: "Login",
  components: {
    LoginForm,
  },
};
</script>
