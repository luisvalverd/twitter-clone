<template>
  <div class="register-container">
    <div class="title-register"><h1>register</h1></div>
    <RegisterForm />
  </div>
</template>

<script>
import RegisterForm from "../components/RegisterForm.vue";

export default {
  name: "Register",
  components: {
    RegisterForm,
  },
};
</script>
