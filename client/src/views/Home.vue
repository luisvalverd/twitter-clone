<template>
  <div class="container mx-auto h-full flex">
    <header class="w-1/4 border-r-2">
      <NavBar />
    </header>
    <!-- post user -->
    <div class="w-2/4">
      <div class="px-8">
        <CardPostUser
          v-for="data in jsonFile"
          :key="data.id_post"
          :nicknameUser="data.nickname"
          :description="data.description"
          :likesCount="data.likes"
          :created="data.created"
          :img="data.avatar"
        />
      </div>
    </div>
    <div class="w-1/4 border-l-2"></div>
  </div>
</template>

<script>
import myJson from "../../MOCK_DATA.json";
import CardPostUser from "../components/CardPostUsers.vue";
import NavBar from "../components/NavBar.vue";

export default {
  name: "Home",
  data() {
    return {
      jsonFile: myJson,
    };
  },
  components: {
    CardPostUser,
    NavBar,
  },
};
</script>
