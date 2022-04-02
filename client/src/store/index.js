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
      isMyProfile: false,
      isFollow: false,
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
      state.user.isMyProfile = dataUser.isMyProfile;
      state.user.isFollow = dataUser.isFollow;
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
    updateUser(contex, newData) {
      axios
        .post("http://localhost:5000/api/v1/post/update-data-user", newData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Token": localStorage.getItem("access-token"),
          },
        })
        .then((res) => {
          localStorage.setItem("access-token", res.headers["access-token"]);
          console.log(res.data);
        })
        .catch((err) => {
          console.log("Failure");
          console.log(err);
        });
    },
    searchDataProfile(context, data) {
      axios
        .post(
          "http://localhost:5000/api/v1/post/find-profile",
          { username: data },
          {
            headers: {
              "Access-Token": localStorage.getItem("access-token"),
            },
          }
        )
        .then((res) => {
          let userData = {
            nickname: res.data.user.nickname,
            avatar: res.data.user.avatar,
            backgroundImg: res.data.user.backgroundImg,
            description: res.data.user.description,
            location: res.data.user.location,
            createdUser: res.data.user.created,
            isMyProfile: res.data.isMyProfile,
            isFollow: res.data.isFollow,
          };
          localStorage.setItem("access-token", res.headers["access-token"]);
          context.commit("updateUserData", userData);
          context.commit("updatePosts", res.data.posts);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    likePost(contex, id_post) {
      axios
        .post(
          "http://localhost:5000/api/v1/post/like-post",
          { id_post },
          {
            headers: {
              "Access-Token": localStorage.getItem("access-token"),
            },
          }
        )
        .then((res) => {
          localStorage.setItem("access-token", res.headers["access-token"]);
          console.log(res.data);
        })
        .catch((err) => console.log(err));
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
