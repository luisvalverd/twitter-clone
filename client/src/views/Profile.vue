<template>
  <div class="container h-full flex lg:mx-auto md:justify-end">
    <header class="w-1/4 navBar lg:w-1/6 2md:w-16 md:w-12 xl:w-1/4">
      <Navbar />
    </header>
    <div class="w-2/4 h-screen content-posts">
      <div class="w-full h-auto">
        <InfoProfile
          :imgSource="'http://localhost:5000/' + getDataUser.avatar"
          :backgroundIMG="'http://localhost:5000' + getDataUser.backgroundIMG"
        />
      </div>
      <div class="px-8 pb-10">
        <CardPostUser
          v-for="data in getPosts"
          :key="data.id_post"
          :nicknameUser="getDataUser.nickname"
          :description="data.description"
          :likesCount="data.likes_post.length"
          :img="'http://localhost:5000/' + getDataUser.avatar"
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
</template>

<script>
import Navbar from "../components/NavBar.vue";
import CardPostUser from "../components/CardPostUsers.vue";
import { mapGetters } from "vuex";
import InfoProfile from "../components/InfoProfile.vue";
import SearchUser from "../components/SearchUser.vue";

export default {
  name: "Profile",
  components: {
    Navbar,
    CardPostUser,
    InfoProfile,
    SearchUser,
  },
  computed: {
    ...mapGetters(["getPosts", "getDataUser"]),
  },
};
</script>

<style>
.content-posts {
  min-width: 640px;
}
</style>
