<template>
  <div>
    <div class="flex h-20">
      <a
        href="#/"
        class="w-full cursor-pointer justify-center items-center border-b-2 text-cyan-600 flex font-bold text-xl hover:text-cyan-500 transition"
      >
        Twitter Clone
      </a>
    </div>
    <div>
      <input
        type="text"
        class="border-2 h-12 w-full focus:border-sky-200 px-4 rounded-full"
      />
    </div>
    <div class="mt-10">
      <ul v-for="follow in following" :key="follow.id_follower">
        <li
          class="w-full h-20 hover:bg-gray-200 flex items-center border-t-2 border-b-2 cursor-pointer"
          @click="
            startChatWithUser({
              nickname: follow.followUser.nickname,
              avatar: follow.followUser.avatar,
              description: follow.followUser.description,
            })
          "
        >
          <div class="w-full px-4 flex items-center">
            <img
              :src="'http://localhost:5000/' + follow.followUser.avatar"
              class="rounded-full w-14 h-14 mr-4 cursor-pointer"
            />
            <div class="flex flex-col cursor-pointer">
              <label class="font-bold text-lg cursor-pointer">{{
                follow.followUser.nickname
              }}</label>
              <label class="font-light text-sm cursor-pointer">{{
                follow.followUser.description
              }}</label>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "Messages",
  data() {
    return {
      following: [],
    };
  },
  methods: {
    ...mapGetters(["getFollowing"]),
    startChatWithUser(data) {
      this.$emit("dataUser", data);
    },
  },
  mounted() {
    //this.following = this.getFollowing();
    //console.log(this.getFollowing());
    axios
      .get("http://localhost:5000/api/v1/gets/my-following", {
        headers: {
          "Access-Token": localStorage.getItem("access-token"),
        },
      })
      .then((res) => {
        localStorage.setItem("access-token", res.headers["access-token"]);
        this.following = res.data;
      })
      .catch((err) => console.log(err));
  },
};
</script>
