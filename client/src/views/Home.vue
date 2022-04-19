<template>
  <div class="container mx-auto h-full flex">
    <div v-if="loading === true">
      <Loading />
    </div>
    <div v-else class="container mx-auto h-full flex">
      <header class="w-1/4">
        <NavBar />
      </header>
      <!-- post user -->
      <div class="w-2/4">
        <!-- make a simple post  -->
        <div class="mx-8 py-4 shadow-xl rounded-xl mt-10 bg-white h-auto">
          <div class="flex flex-col mx-8">
            <label class="text-2xl text-gray-600 mt-2">How is your day?</label>
            <textarea
              cols="30"
              rows="5"
              class="border-2 p-4 border-gray-300 rounded-xl my-2"
              placeholder="I work today!"
              ref="descriptionPost"
              v-model="description"
            ></textarea>
          </div>
          <div class="flex justify-end mx-8 my-2">
            <button
              class="bg-sky-400 cursor-pointer hover:bg-sky-500 h-12 w-28 rounded-lg"
              @click="makeSimplePost"
            >
              Public
            </button>
          </div>
        </div>
        <!-- get a post -->
        <div class="px-8">
          <CardPostUser
            v-for="data in posts"
            :key="data.id_post"
            :nicknameUser="data.user.nickname"
            :description="data.user.description"
            :likesCount="data.likes_post.length"
            :created="data.created"
            :img="'http://localhost:5000/' + data.user.avatar"
            :photoPost="data.photo"
            :idPost="data.id_post"
          />
        </div>
      </div>
      <div class="w-1/4">
        <SearchUser />
      </div>
    </div>
  </div>
</template>

<script>
import CardPostUser from "../components/CardPostUsers.vue";
import NavBar from "../components/NavBar.vue";
import SearchUser from "../components/SearchUser.vue";
import Loading from "../components/Loading.vue";
import { mapActions } from "vuex";
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      loading: true,
      description: "",
      posts: [],
    };
  },
  components: {
    CardPostUser,
    NavBar,
    SearchUser,
    Loading,
  },
  mounted() {
    this.loading = false;
    axios
      .get("http://localhost:5000/api/v1/gets/post-following", {
        headers: {
          "Access-Token": localStorage.getItem("access-token"),
        },
      })
      .then((res) => {
        localStorage.setItem("access-token", res.headers["access-token"]);
        this.posts = res.data;
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
  methods: {
    ...mapActions(["createPost"]),
    makeSimplePost() {
      let formData = new FormData();
      formData.append("description", this.description);
      formData.append("foto", null);
      this.createPost(formData);

      this.$refs.descriptionPost[0] = "";
      this.description = "";
    },
  },
};
</script>
