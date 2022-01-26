<template>
  <div class="container mx-auto h-full flex justify-center items-center">
    <div class="w-5/12 h-3/5 shadow-2xl rounded-2xl p-8 bg-white">
      <div class="py-4">
        <h1 class="text-center text-5xl font-sans">Fwitter Clone</h1>
      </div>
      <RegisterForm />
    </div>
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
