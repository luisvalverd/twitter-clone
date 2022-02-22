import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Profile from "../views/Profile.vue";

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

router.beforeEach((to, from, next) => {
  store.dispatch("fetchAccessToken");
  let nickname = "/profile/" + to.params.nickname;
  if (
    to.fullPath === "/about" ||
    to.fullPath === "/" ||
    to.fullPath === nickname
  ) {
    if (!store.state.authUser.token) {
      next("/login");
    }
  }
  if (to.fullPath === "/login" || to.fullPath === "/register") {
    if (store.state.authUser.token) {
      next("/");
    }
  }
  next();
});

router.afterEach((to) => {
  let nickname = "/profile/" + to.params.nickname;
  if (to.fullPath === nickname) {
    //store.dispatch("getMyPosts");
    store.dispatch("searchDataProfile", to.params.nickname);
  }
});

export default router;
