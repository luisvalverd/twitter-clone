import { createStore } from "vuex";
import axios from "axios";
import router from "../router";

export default createStore({
  state: {
    user: {
      nickname: null,
      avatar: null,
      backgroundIMG: null,
      description: "",
      location: "",
      createdUser: null,
    },
    posts: [],
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
    updateUserData(state, dataUser) {
      state.user.nickname = dataUser.nickname;
      state.user.avatar = dataUser.avatar;
      state.user.description = dataUser.description;
      state.user.location = dataUser.location;
      state.user.backgroundIMG = dataUser.backgroundImg;
      state.user.createdUser = dataUser.created;
    },
    updatePosts(state, posts) {
      state.posts = posts;
    },
  },
  actions: {
    loginUser(context, dataUser) {
      context.commit("loginStart");
      axios
        .post("http://localhost:5000/api/v1/auth/login", dataUser)
        .then((res) => {
          localStorage.setItem("access-token", res.headers["access-token"]);
          //localStorage.setItem("user-data", res.data.nickname);
          context.commit("updateToken", res.headers["access-token"]);
          context.commit("updateUserData", res.data);
          context.commit("loginStop", null);
          router.push("/");
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
          //localStorage.setItem("user-data", res.data.nickname);
          contex.commit("updateToken", res.headers["access-token"]);
          contex.commit("updateUserData", res.data);
          contex.commit("loginStop", null);
          router.push("/");
        })
        .catch((error) => {
          contex.commit("loginStop", error.message);
        });
    },
    fetchAccessToken(contex) {
      contex.commit("updateToken", localStorage.getItem("access-token"));
      //contex.commit("updateUserData", localStorage.getItem("user-data"));
    },
    logout(context) {
      localStorage.removeItem("access-token");
      //localStorage.removeItem("user-data");
      context.commit("logout");
      router.push("/login");
    },
    getMyPosts(contex) {
      axios
        .get("http://localhost:5000/api/v1/gets/my-posts", {
          headers: {
            "Access-Token": localStorage.getItem("access-token"),
          },
        })
        .then((res) => {
          localStorage.setItem("access-token", res.headers["access-token"]);
          contex.commit("updateToken", res.headers["access-token"]);
          contex.commit("updateUserData", res.data.user);
          contex.commit("updatePosts", res.data.MyPosts);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateUser(contex, newData) {
      console.log(newData.avatar);
    },
  },
  getters: {
    getPosts(state) {
      return state.posts;
    },
    getDataUser(state) {
      return state.user;
    },
  },
  modules: {},
});
