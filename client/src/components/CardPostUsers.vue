<template>
  <div
    class="container mx-auto my-8 rounded-2xl bg-white flex flex-col h-auto shadow-xl p-8"
  >
    <div class="py-1 flex flex-col">
      <!-- add image avatar user -->
      <div class="flex flex-row items-center py-2">
        <img :src="img" class="rounded-full border-2 w-16" />
        <label class="text-xl px-4">{{ nicknameUser }}</label>
      </div>
      <label class="text-sm text-gray-500">{{ created }}</label>
    </div>
    <div class="card-body">
      <p class="card--post-user">
        {{ description }}
      </p>
    </div>
    <div class="flex flex-row py-2 items-center">
      <div ref="likeSvg" class="cursor-pointer">
        <component v-bind:is="like" @click="handleLikes" />
      </div>
      <label class="px-2 flex text-sm text-gray-600 items-center">
        {{ likesCount }}
      </label>
    </div>
  </div>
</template>

<script>
import LikeSvg from "./LikeSvg.vue";
import LikeSvgSolid from "./LikeSvgSolid.vue";
import { likeAnimation } from "../assets/animations/animations";

export default {
  name: "CardPostUser",
  data() {
    return {
      like: "LikeSvg",
    };
  },
  methods: {
    handleLikes() {
      likeAnimation(this.$refs.likeSvg);
      if (this.like === "LikeSvg") {
        this.like = "LikeSvgSolid";
      } else {
        this.like = "LikeSvg";
      }
    },
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
      required: true,
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
  },
  components: {
    LikeSvg,
    LikeSvgSolid,
  },
};
</script>
