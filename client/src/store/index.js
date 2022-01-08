import { createStore } from "vuex";
import axios from "axios";
import router from "../router";

export default createStore({
  state: {
    authUser: {
      token: null,
      authIn: false,
      authError: null,
    },
  },
  mutations: {
    loginStart(state) {
      state.authUser.authIn = true;
    },
    updateToken(state, token) {
      state.authUser.token = token;
    },
    loginStop(state, errorMessage) {
      state.authUser.authIn = false;
      state.authUser.authError = errorMessage;
    },
    logout(state) {
      state.authUser.token = null;
    },
  },
  actions: {
    loginUser(context, dataUser) {
      context.commit("loginStart");
      axios
        .post("http://localhost:5000/api/v1/auth/login", dataUser)
        .then((res) => {
          localStorage.setItem("access-token", res.headers["access-token"]);
          context.commit("updateToken", res.headers["access-token"]);
          context.commit("loginStop", null);
          router.push("/about");
        })
        .catch((error) => {
          context.commit("loginStop", error.message);
        });
    },
    registerUser(contex, dataUser) {
      contex.commit("loginStart");
      axios
        .post("http://localhost:5000/api/v1/auth/register", dataUser)
        .then((res) => {
          localStorage.setItem("access-token", res.headers["access-token"]);
          contex.commit("updateToken", res.headers["access-token"]);
          contex.commit("loginStop", null);
          router.push("/about");
        })
        .catch((error) => {
          contex.commit("loginStop", error.message);
        });
    },
    fetchAccessToken(contex) {
      contex.commit("updateToken", localStorage.getItem("access-token"));
    },
    logout(context) {
      localStorage.removeItem("access-token");
      context.commit("logout");
      router.push("/login");
    },
  },
  modules: {},
});
