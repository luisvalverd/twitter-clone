import { createStore } from "vuex";
import axios from "axios";
import router from "../router";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

/**
 * *save data of user in cookies
 */

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
    chat: {
      socketInstance: io("ws://localhost:5000"),
      messages: [],
    },
    myFollowing: [],
    postFollows: [],
    likes: [],
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
      state.postFollows = [];
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
      state.likes = dataUser.likes;
    },
    updateCookiesUser(state, data) {
      Cookies.set("user", JSON.stringify(data));
    },
    updatePosts(state, posts) {
      state.posts = posts;
    },
    startSocket(state) {
      state.chat.socketInstance.emit("start", state.user.nickname);
    },
    updateMyFollowing(state, following) {
      state.myFollowing = following;
    },
    addNewFollowing(state, data) {
      state.myFollowing.push(data);
    },
    updatePostFollows(state, data) {
      state.postFollows = data;
    },
    updateLikes(state, data) {
      state.likes = data;
      Cookies.set("likes", JSON.stringify(data));
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
          context.commit("updateLikes", res.data.likes);
          context.commit("updateUserData", res.data);
          context.commit("updateCookiesUser", res.data);
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
          contex.commit("updateToken", res.headers["access-token"]);
          contex.commit("updateUserData", res.data);
          contex.commit("updateCookiesUser", res.data);
          contex.commit("loginStop", null);
          router.push("/");
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
      if (Cookies.get("user")) {
        Cookies.remove("user");
      }
      if (Cookies.get("likes")) {
        Cookies.remove("likes");
      }
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
          console.log(err.message);
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
    startChat(contex) {
      contex.commit("startSocket");
      contex.dispatch("getMyFollows");
    },
    getMyFollows(contex) {
      axios
        .get("http://localhost:5000/api/v1/gets/my-following", {
          headers: {
            "Access-Token": localStorage.getItem("access-token"),
          },
        })
        .then((res) => {
          localStorage.setItem("access-token", res.headers["access-token"]);
          contex.commit("updateMyFollowing", res.data.followUser);
        })
        .catch((err) => console.log(err));
    },
    updateUserDataStore(context, data) {
      context.commit("updateUserData", data);
    },
    createPost(context, data) {
      axios
        .post("http://localhost:5000/api/v1/post/create-post", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Token": localStorage.getItem("access-token"),
          },
        })
        .then((res) => {
          localStorage.setItem("access-token", res.headers["access-token"]);
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    followUser(context, data) {
      axios
        .post(
          "http://localhost:5000/api/v1/post/follow-user",
          { nicknameUserFollow: data },
          {
            headers: {
              "Access-Token": localStorage.getItem("access-token"),
            },
          }
        )
        .then((res) => {
          localStorage.setItem("access-token", res.headers["access-token"]);
          context.commit("addNewFollowing", {
            followUser: res.data.follower.followUser, // data of user following
          });
          router.go();
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    unFollowUser(context, data) {
      axios
        .post(
          "http://localhost:5000/api/v1/post/unfollow-user",
          { nicknameUserFollow: data },
          {
            headers: {
              "Access-Token": localStorage.getItem("access-token"),
            },
          }
        )
        .then((res) => {
          localStorage.setItem("access-token", res.headers["access-token"]);
          this.dispatch("getMyFollows");
          router.go();
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    getPostFollows(context) {
      axios
        .get("http://localhost:5000/api/v1/gets/post-following", {
          headers: {
            "Access-Token": localStorage.getItem("access-token"),
          },
        })
        .then((res) => {
          localStorage.setItem("access-token", res.headers["access-token"]);
          context.commit("updatePostFollows", res.data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    updateLikesDataStore(context, data) {
      context.commit("updateLikes", data);
    },
    getIdLikes(context) {
      axios
        .get("http://localhost:5000/api/v1/gets/my-likes", {
          headers: {
            "Access-Token": localStorage.getItem("access-token"),
          },
        })
        .then((res) => {
          localStorage.setItem("access-token", res.headers["access-token"]);
          context.commit("updateLikes", res.data);
          //Cookies.set("likes", JSON.stringify(res.data));
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  },
  getters: {
    getPosts(state) {
      return state.posts;
    },
    getDataUser(state) {
      return state.user;
    },
    getSocket(state) {
      return state.chat;
    },
    getFollowing(state) {
      return state.myFollowing;
    },
    getPostFollow(state) {
      return state.postFollows;
    },
    getLikesPost(state) {
      return state.likes;
    },
  },
  modules: {},
});
