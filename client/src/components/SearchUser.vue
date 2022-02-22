<template>
  <div>
    <div
      class="mt-10 flex flex-row justify-center bg-white pl-6 rounded-full border-2 hover:border-sky-600"
      id="search-div"
      ref="conteiner_search"
      @click="selectSearch"
    >
      <div class="flex items-center bg-transparent">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ref="icon_search"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        ref="search"
        type="text"
        placeholder="Search"
        @keyup="searchRefs($event.target.value)"
        class="w-96 h-12 rounded-full px-6 outline-none font-light text-gray-500"
        @keyup.enter="searchRefs($event.target.value)"
        @focus="handleFocus"
      />
    </div>
    <div
      v-if="results.length > 0"
      class="mt-8 bg-white py-4 border-2 rounded-xl"
    >
      <ul>
        <li
          v-for="user in results"
          class="w-full h-16 hover:bg-gray-200 flex items-center"
          :key="user.id"
        >
          <a :href="`/#/profile/${user.nickname}`">
            <div
              class="w-full px-4 flex items-center"
              @click="searchUser(user.nickname)"
            >
              <img
                :src="'http://localhost:5000/' + user.avatar"
                class="rounded-full w-14 h-14 mr-4"
              />
              <div class="flex flex-col">
                <label class="font-bold text-lg">{{ user.nickname }}</label>
                <label class="font-light text-sm">{{ user.description }}</label>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  name: "SearchUser",
  data: () => {
    return {
      dataSearch: "",
      results: [],
      isSelected: false,
    };
  },
  methods: {
    ...mapActions(["searchDataProfile"]),
    selectSearch() {
      this.$refs.search.focus();
    },
    handleFocus(event) {
      if (event.isTrusted) {
        this.isSelected = true;
      } else {
        this.isSelected = false;
      }
    },
    searchRefs(data) {
      this.dataSearch = data;
      axios
        .post(
          "http://localhost:5000/api/v1/post/search-user",
          { username: this.dataSearch },
          {
            headers: {
              "Access-Token": localStorage.getItem("access-token"),
            },
          }
        )
        .then((res) => {
          this.results = res.data;
          localStorage.setItem("access-token", res.headers["access-token"]);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    searchUser(data) {
      this.searchDataProfile(data);
    },
  },
};
</script>
