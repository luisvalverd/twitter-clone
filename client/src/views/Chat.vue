<template>
  <div class="h-full">
    <div class="h-full">
      <div class="container flex h-full border-r-2 border-l-2">
        <section class="w-1/4 h-full border-r-2">
          <ChatUsers @dataUser="getUser"></ChatUsers>
        </section>
        <section class="w-3/4 flex flex-col justify-between h-full">
          <div class="h-20 flex items-center border-b-2">
            <div v-if="user === ''">
              <h1 class="mx-4">Chat</h1>
            </div>
            <div v-else class="mx-4 flex items-center">
              <img
                :src="'http://localhost:5000/' + avatar"
                class="rounded-full w-14 h-14 mr-4"
              />
              <div class="flex flex-col cursor-pointer">
                <label class="font-bold text-lg cursor-pointer">{{
                  user
                }}</label>
                <label class="font-light text-sm cursor-pointer">{{
                  description
                }}</label>
              </div>
            </div>
          </div>
          <div class="">
            <ul v-for="message in messages" v-bind:key="message.id">
              <li class="mx-4 h-6">
                <b>{{ message.user }}</b>
                : {{ message.text }}
              </li>
            </ul>
            <div class="w-full">
              <input
                type="text"
                class="w-10/12 h-14 border-2 px-4 hover:border-sky-500"
                placeholder="message"
                v-model="text"
                @keyup.enter="sendMessage"
              />
              <button
                class="h-14 w-2/12 bg-sky-400 hover:bg-sky-500 transition"
                @click="sendMessage"
              >
                send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
//import io from "socket.io-client";
import store from "../store/index";
import ChatUsers from "../components/ChatUsers.vue";
import { mapGetters } from "vuex";

export default {
  name: "Chat",
  data() {
    return {
      currentUser: store.state.user.nickname,
      text: "",
      messages: [],
      user: "",
      avatar: "",
      description: "",
    };
  },
  components: {
    ChatUsers,
  },
  methods: {
    ...mapGetters(["getSocket"]),
    sendMessage() {
      this.addMessage();

      this.text = "";
    },
    addMessage() {
      const message = {
        id: new Date().getTime(),
        text: this.text,
        user: this.currentUser,
        room: this.user,
      };

      this.messages = this.messages.concat(message);
      console.log(this.messages);

      this.getSocket().socketInstance.emit("message", message);
    },
    getUser(dataUser) {
      this.user = dataUser.nickname;
      this.avatar = dataUser.avatar;
      this.description = dataUser.description;
    },
  },
  mounted() {
    this.getSocket().socketInstance.on("message:recived", (data) => {
      this.messages = this.messages.concat(data);
    });
  },
};
</script>
