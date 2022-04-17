<template>
  <div class="w-full h-auto">
    <div class="overflow-hidden">
      <img :src="backgroundIMG" class="w-full h-64" />
      <img
        :src="imgSource"
        class="rounded-full w-32 h-32 absolute top-48 mx-8 border-2"
      />
      <section class="flex top-72 h-10 w-full mt-10 justify-end">
        <button
          v-if="getDataUser.isMyProfile === true"
          class="w-32 h-full rounded-full bg-sky-400 text-lg mr-8 hover:bg-sky-500"
          @click="modal = true"
        >
          Edit
        </button>
        <button
          v-else-if="getDataUser.isFollow === false"
          class="w-32 h-full rounded-full bg-gray-100 text-lg mr-8 hover:bg-gray-200 border-2"
          @click="follow"
        >
          Follow
        </button>
        <button
          v-else
          class="w-32 h-full rounded-full bg-sky-400 text-lg mr-8 hover:bg-sky-500"
          @click="unfollow"
        >
          Unfollow
        </button>
        <div>
          <EditProfile v-show="modal" :open="modal" @close="closeModal" />
        </div>
      </section>
      <section class="w-32 p-1 mt-2 mx-8 flex">
        <label class="text-2xl">{{ getDataUser.nickname }}</label>
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
/**
 * TODO: boton cambie if yo sigo al usuario;
 */
import { mapGetters, mapActions } from "vuex";
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
    props: {
      imgSource: String,
      backgroundIMG: String,
    },
    closeModal(value) {
      this.modal = value;
    },
    ...mapActions(["followUser", "unFollowUser"]),
    follow() {
      this.followUser(this.getDataUser.nickname);
    },
    unfollow() {
      this.unFollowUser(this.getDataUser.nickname);
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
