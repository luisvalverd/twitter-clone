<template>
  <div class="container h-full flex">
    <div v-if="loading === true" class="w-full">
      <Loading />
    </div>
    <div class="flex container lg:mx-auto md:justify-end" v-else>
      <header class="w-1/4 navBar lg:w-1/6 2md:w-16 md:w-12 xl:w-1/4">
        <Navbar />
      </header>
      <div class="w-2/4 h-screen content-posts">
        <div class="w-full h-auto">
          <InfoProfile
            :imgSource="'http://localhost:5000/' + userData.avatar"
            :backgroundIMG="'http://localhost:5000/' + userData.backgroundIMG"
          />
        </div>
        <div class="px-8 pb-10">
          <CardPostUser
            v-for="data in getPosts"
            :key="data.id_post"
            :nicknameUser="userData.nickname"
            :description="data.description"
            :likesCount="data.likes_post.length"
            :img="'http://localhost:5000/' + userData.avatar"
            :created="data.created"
            :photoPost="data.photo"
            :idPost="data.id_post"
          />
        </div>
      </div>
      <div class="w-1/4 md:hidden lg:flex">
        <SearchUser class="pl-8" />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import CardPostUser from "../components/CardPostUsers.vue";
import { mapGetters, mapActions } from "vuex";
import InfoProfile from "../components/InfoProfile.vue";
import SearchUser from "../components/SearchUser.vue";
import store from "../store/index";
import Loading from "../components/Loading.vue";

export default {
  name: "Profile",
  data() {
    return {
      loading: true,
      userData: null,
      posts: null,
    };
  },
  components: {
    Navbar,
    CardPostUser,
    InfoProfile,
    SearchUser,
    Loading,
  },
  computed: {
    ...mapGetters(["getPosts", "getDataUser"]),
    ...mapActions(["updateUserDataStore"]),
  },
  created() {
    let user = this.$cookies.get("user");
    if (store.state.user.nickname === null && user.nickname !== null) {
      //this.updateUserDataStore(user);
      this.$store.dispatch("updateUserDataStore", user);
    }
  },
  async mounted() {
    this.userData = await this.getDataUser;
    this.loading = false;

    console.log(this.getPosts);
  },
};
</script>

<style>
.content-posts {
  min-width: 640px;
}
</style>
