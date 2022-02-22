<template>
  <div class="container grid grid-rows-3 h-auto">
    <div class="h-24 flex flex-wrap">
      <label class="font-sans text-xl text-center">Nickname</label>
      <input
        class="font-sans w-full border-2 rounded-lg text-lg px-4"
        v-model="dataUser.nickname"
        type="text"
        v-on:keyup.enter="sendData"
      />
    </div>
    <div class="h-24 flex flex-wrap">
      <label class="font-sans text-xl text-center">Password</label>
      <input
        class="font-sans w-full border-2 rounded-lg text-lg px-4"
        v-model="dataUser.password"
        type="password"
        v-on:keyup.enter="sendData"
      />
    </div>
    <div class="flex items-center">
      <button
        class="w-full h-10 bg-sky-500 rounded-lg text-lg transition hover:bg-sky-600"
        @click="sendData"
      >
        Sing In
      </button>
    </div>
    <div class="flex justify-center">
      <a
        class="underline decoration-solid text-blue-700 transition hover:text-blue-800"
        href="/#/register"
      >
        Register
      </a>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginForm",
  data: () => ({
    dataUser: {
      nickname: "",
      password: "",
    },
  }),
  methods: {
    ...mapActions(["loginUser"]),
    sendData() {
      this.loginUser(this.dataUser);
    },
  },
};
</script>
