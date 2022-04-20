import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Profile from "../views/Profile.vue";
import CreatePost from "../views/CreatePost.vue";
import Chat from "../views/Chat.vue";
import Cookies from "js-cookie";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/profile/:nickname",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/create-post",
    name: "CreatePost",
    component: CreatePost,
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// * if is null and cookie get data change null with data nicknanme of cookies

router.beforeEach((to, from, next) => {
  store.dispatch("fetchAccessToken");
  let nickname = "/profile/" + to.params.nickname;

  if (
    to.fullPath === "/chat" ||
    to.fullPath === "/" ||
    to.fullPath === nickname
  ) {
    if (!store.state.authUser.token || !store.state.user) {
      next("/login");
    }
  }
  if (to.fullPath === "/login" || to.fullPath === "/register") {
    if (store.state.authUser.token) {
      next("/");
    }
  }

  if (to.fullPath === "/") {
    store.dispatch("getPostFollows");
  }

  // * update data user with cookies
  if (to.fullPath === nickname) {
    if (!Cookies.get("user") && store.state.user.nickname === null) {
      store.dispatch("logout");
    }

    let user = JSON.parse(Cookies.get("user"));

    if (to.params.nickname !== "null") {
      store.dispatch("searchDataProfile", to.params.nickname);
    }
    if (to.params.nickname === "null" && user.nickname !== null) {
      store.dispatch("updateUserDataStore", user);
      next("/profile/" + user.nickname);
    }
  }

  if (to.fullPath === "/chat") {
    if (!Cookies.get("user") && store.state.user.nickname === null) {
      store.dispatch("logout");
    }

    let user = JSON.parse(Cookies.get("user"));
    if (store.state.user.nickname === null && user.nickname !== null) {
      store.dispatch("updateUserDataStore", user);
    }
    // ? update my data user
    if (store.state.user.nickname !== user.nickname) {
      store.dispatch("updateUserDataStore", user);
    }
  }

  next();
});

export default router;
