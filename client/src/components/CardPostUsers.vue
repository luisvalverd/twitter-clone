<template>
  <div
    class="container mx-auto my-8 rounded-2xl bg-white flex flex-col h-auto shadow-xl p-8"
  >
    <div class="py-1 flex flex-col">
      <!-- add image avatar user -->
      <div class="flex flex-row items-center py-2">
        <img :src="img" class="rounded-full border-2 w-16 h-16" />
        <label class="text-xl px-4">{{ nicknameUser }}</label>
      </div>
      <label class="text-sm text-gray-500">{{ created }}</label>
    </div>
    <div class="card-body">
      <p class="card--post-user">
        {{ description }}
      </p>
    </div>
    <div v-if="photoPost !== '' && photoPost !== 'null'">
      <img
        :src="'http://localhost:5000/' + photoPost"
        class="rounded-xl mt-10 mb-5"
      />
    </div>
    <div class="flex flex-row py-2 items-center">
      <div ref="likeSvg" class="cursor-pointer">
        <component v-bind:is="like" @click="handleLikes" />
      </div>
      <label class="px-2 flex text-sm text-gray-600 items-center">
        {{ likesUpdate }}
      </label>
    </div>
  </div>
</template>

<script>
/**
 * * mostrar en cartas los post que hacen los usuarios
 * TODO: Modificar el boton Edit para que solo aparezca en mi profile y al acceder a otro cambiarlo por sergir
 */
import LikeSvg from "./LikeSvg.vue";
import LikeSvgSolid from "./LikeSvgSolid.vue";
import { likeAnimation } from "../assets/animations/animations";
import axios from "axios";
//import store from "../store";
import { mapGetters } from "vuex";

export default {
  name: "CardPostUser",
  data() {
    return {
      like: "LikeSvg",
      likesUpdate: this.likesCount,
    };
  },
  props: {
    nicknameUser: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    likesCount: {
      type: Number,
    },
    created: {
      required: true,
      type: String,
    },
    img: {
      required: false,
      type: String,
    },
    photoPost: {
      required: false,
      type: String,
    },
    idPost: {
      type: String,
    },
  },
  methods: {
    ...mapGetters(["getLikesPost"]),
    props: {
      idPost: {
        type: String,
      },
    },
    handleLikes() {
      likeAnimation(this.$refs.likeSvg);
      if (this.like === "LikeSvg") {
        this.like = "LikeSvgSolid";
      } else {
        this.like = "LikeSvg";
      }
      this.likePublic();
    },
    likePublic() {
      axios
        .post(
          "http://localhost:5000/api/v1/post/like-post",
          { id_post: this.idPost },
          {
            headers: {
              "Access-Token": localStorage.getItem("access-token"),
            },
          }
        )
        .then((res) => {
          localStorage.setItem("access-token", res.headers["access-token"]);
          this.likesUpdate = res.data.likes;
        })
        .catch((err) => console.log(err));
    },
  },
  async created() {
    let likesPost = await this.getLikesPost();
    if (likesPost.includes(this.idPost)) {
      this.like = "LikeSvgSolid";
    }
  },
  components: {
    LikeSvg,
    LikeSvgSolid,
  },
};
</script>
