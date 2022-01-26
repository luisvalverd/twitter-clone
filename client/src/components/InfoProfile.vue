<template>
  <div class="w-full h-auto">
    <div class="">
      <img :src="backgroundIMG" class="w-full h-64" />
      <img :src="imgSource" class="rounded-full w-32 fixed top-48 mx-8" />
      <section class="w-32 p-1 mt-16 mx-8 flex">
        <label class="text-2xl">{{ getDataUser.nickname }}</label>
      </section>
      <section class="fixed top-72 h-10 right-1/4 mr-32 w-24">
        <button
          class="w-full h-full rounded-full bg-sky-400 text-lg hover:bg-sky-500"
          @click="modal = true"
        >
          Edit
        </button>
        <div>
          <EditProfile v-show="modal" :open="modal" @close="closeModal" />
        </div>
      </section>
    </div>
    <div class="p-1 mx-8">
      <section>
        <label class="text-sm text-gray-400">
          user created: {{ getDataUser.createdUser }}
        </label>
        <br />
        <label
          v-if="getDataUser.location.length > 0"
          class="text-sm text-gray-400"
        >
          location: {{ getDataUser.location }}
        </label>
        <label v-else class="text-sm text-gray-400">
          location: donnot any location
        </label>
      </section>
      <section v-if="getDataUser.description.length > 0">
        <p>{{ getDataUser.description }}</p>
      </section>
      <section v-else>
        <p>donnot have any description</p>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EditProfile from "./ModalEditProfile.vue";

export default {
  name: "InfoProfile",
  data() {
    return {
      modal: false,
    };
  },
  props: {
    imgSource: String,
    backgroundIMG: String,
  },
  methods: {
    closeModal(value) {
      this.modal = value;
    },
  },
  computed: {
    ...mapGetters(["getDataUser"]),
  },
  components: {
    EditProfile,
  },
};
</script>
