<template>
  <div class="h-full flex flex-col p-10 items-end">
    <div class="w-10/12 h-auto">
      <ul class="w-full px-2 h-auto">
        <li class="w-full h-14">
          <a
            class="w-full text-cyan-700 font-bold text-xl px-5 py-4 transition rounded-full hover:bg-gray-200"
            href="/#/"
          >
            <label class="mx-4">Twitter Clone</label>
          </a>
        </li>
        <li class="w-full h-14">
          <a
            class="w-full h-1/2 text-lg px-6 py-4 transition rounded-full hover:bg-gray-200"
            href="/#/"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7 mx-2 inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <label class="mx-2">Home</label>
          </a>
        </li>
        <li class="w-full h-14">
          <a
            class="w-full h-1/2 text-lg px-6 py-4 transition rounded-full hover:bg-gray-200"
            :href="`/#/profile/${myNickname}`"
            @click="getMyPosts"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7 inline mx-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <label class="mx-2">My Profile</label>
          </a>
        </li>
        <li class="w-full h-14">
          <a
            class="w-full h-1/2 text-lg px-6 py-4 transition rounded-full hover:bg-gray-200"
            href="/#/login"
            @click="logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7 inline mx-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <label class="mx-2">logout</label>
          </a>
        </li>
        <li class="w-full h-14">
          <button
            class="cursor-pointer bg-sky-400 w-auto h-12 text-lg flex items-center px-6 transition rounded-full hover:bg-sky-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7 inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <label class="mx-2">Create Post</label>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import store from "../store/index";

export default {
  name: "NavBar",
  data() {
    return {
      myNickname: store.state.user.nickname,
    };
  },
  methods: {
    ...mapActions(["logout", "getMyPosts"]),
  },
};
</script>
