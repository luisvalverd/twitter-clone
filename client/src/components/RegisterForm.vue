<template>
  <div class="container grid grid-rows-4 h-auto">
    <div class="h-24 flex flex-wrap">
      <label class="font-sans text-xl text-center">Nickname</label>
      <input
        class="font-sans w-full border-2 rounded-lg text-lg"
        type="text"
        v-model="nickname"
      />
    </div>
    <div class="h-24 flex flex-wrap">
      <label class="font-sans text-xl text-center">Password</label>
      <input
        class="font-sans w-full border-2 rounded-lg text-lg"
        type="password"
        v-model="password"
      />
    </div>
    <div class="h-24 flex flex-wrap">
      <label class="font-sans text-xl text-center">Confirm Password</label>
      <input
        class="font-sans w-full border-2 rounded-lg text-lg"
        type="password"
        v-model="confirmPassword"
      />
    </div>
    <div class="flex items-center">
      <button
        class="w-full h-10 bg-sky-500 rounded-lg text-ls transition hover:bg-sky-600"
        @click="register"
      >
        Sign Up
      </button>
    </div>
    <div class="flex justify-center">
      <a
        class="underline decoration-solid text-blue-700 transition hover:text-blue-800"
        href="/#/login"
      >
        Login
      </a>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "RegisterForm",
  data() {
    return {
      nickname: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    ...mapActions(["registerUser"]),
    register() {
      this.registerUser({
        nickname: this.nickname,
        password: this.password,
        confirmPassword: this.confirmPassword,
      });
    },
  },
};
</script>
