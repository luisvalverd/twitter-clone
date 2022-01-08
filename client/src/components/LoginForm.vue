<template>
  <div class="login-form">
    <label>Nickname</label>
    <input v-model="dataUser.nickname" type="text" />
    <label>Password</label>
    <input v-model="dataUser.password" type="password" />
    <button class="btn-primary" @click="sendData">Log In</button>
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
