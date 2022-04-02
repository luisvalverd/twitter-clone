<template>
  <div class="h-full container mx-auto flex">
    <div class="w-1/4">
      <NavBar />
    </div>
    <div
      class="flex flex-col w-2/4 h-1/3 mt-52 rounded-lg bg-white shadow-xl py-10"
    >
      <div class="flex justify-center mb-5">
        <h1 class="text-4xl text-gray-700">Create Post</h1>
      </div>
      <div class="w-full px-10">
        <label class="my-2">Description</label>
        <textarea
          name="description"
          class="w-full h-24 bottom-2 my-2 p-2 rounded-md border-2"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";

export default {
  name: "CreatePost",
  components: {
    NavBar,
  },
};
</script>
