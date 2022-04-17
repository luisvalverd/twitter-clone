<template>
  <div class="h-full container mx-auto flex">
    <div class="w-1/4">
      <NavBar />
    </div>
    <div class="w-2/4 h-fit mt-52 rounded-lg bg-white shadow-xl py-10">
      <div class="flex justify-center mb-5">
        <h1 class="text-4xl text-gray-700">Create Post</h1>
      </div>
      <div class="w-full px-10">
        <label class="my-2 text-sm text-gray-500">Description</label>
        <textarea
          name="description"
          v-model="description"
          class="w-full h-24 bottom-2 my-2 p-2 rounded-md border-2"
        ></textarea>
      </div>
      <div class="w-full flex justify-start px-10 mt-2 flex-col">
        <label class="my-2 text-sm text-gray-500">image (optional)</label>
        <input
          type="file"
          name="photo"
          ref="photo"
          @change="handleImg"
          id="photo"
        />
      </div>
      <div class="w-full flex justify-start px-10 mt-2 flex-col">
        <label class="my-2 text-sm text-gray-500">private post</label>
        <div>
          <label class="mr-2">Private: </label>
          <input
            type="checkbox"
            name="isPrivated"
            v-model="privatePost"
            @click="changeStatePrivate"
            id="isPrivated"
          />
        </div>
      </div>
      <div class="w-full flex justify-end px-10 mt-5">
        <button
          class="w-24 bg-sky-400 rounded-md h-10 hover:bg-sky-500 cursor-pointer"
          @click="sendPost"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import { mapActions } from "vuex";

export default {
  name: "CreatePost",
  components: {
    NavBar,
  },
  data() {
    return {
      privatePost: false,
      description: "",
      photo: null,
    };
  },
  methods: {
    ...mapActions(["createPost"]),
    changeStatePrivate() {
      if (this.privatePost === false) {
        this.privatePost = true;
      } else {
        this.privatePost = false;
      }
    },
    sendPost() {
      let formData = new FormData();
      formData.append("photo", this.photo);
      formData.append("description", this.description);
      formData.append("private", JSON.stringify(this.privatePost));

      this.createPost(formData);
      this.$router.push("/");
    },
    handleImg() {
      this.photo = this.$refs.photo.files[0];
    },
  },
};
</script>
