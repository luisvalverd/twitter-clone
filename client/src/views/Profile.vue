<template>
  <div class="container mx-auto h-full flex">
    <header class="w-1/4 border-r-2">
      <Navbar />
    </header>
    <div class="w-2/4">
      <div class="w-full h-auto">
        <InfoProfile
          :imgSource="'http://localhost:5000' + getDataUser.avatar"
          :backgroundIMG="'http://localhost:5000' + getDataUser.backgroundIMG"
        />
      </div>
      <div class="px-8">
        <CardPostUser
          v-for="data in getPosts"
          :key="data.id_post"
          :nicknameUser="getDataUser.nickname"
          :description="data.description"
          :likesCount="0"
          :img="'http://localhost:5000' + getDataUser.avatar"
          :created="data.created"
        />
      </div>
    </div>
    <div class="w-1/4 border-l-2"></div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import CardPostUser from "../components/CardPostUsers.vue";
import { mapGetters } from "vuex";
import InfoProfile from "../components/InfoProfile.vue";

export default {
  name: "Profile",
  components: {
    Navbar,
    CardPostUser,
    InfoProfile,
  },
  computed: {
    ...mapGetters(["getPosts", "getDataUser"]),
  },
};
</script>
