<template>
  <div class="container mx-auto h-full flex justify-center items-center">
    <div class="w-5/12 h-auto shadow-2xl rounded-2xl p-8 bg-white">
      <div class="py-4">
        <h1 class="text-center text-5xl font-sans">Fwitter Clone</h1>
      </div>
      <LoginForm />
    </div>
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
