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
          <div v-if="user === ''">
            <div class="flex justify-center items-center">
              <label class="text-8xl text-gray-400">Select a Chat</label>
            </div>
          </div>
          <div>
            <ul v-for="message in messages" v-bind:key="message.id">
              <li
                class="flex mx-4 h-8 my-2"
                v-if="message.emitter !== getDataUser().nickname"
              >
                <div class="bg-gray-200 rounded-full px-5 flex items-center">
                  <b>{{ message.emitter }}</b>
                  : {{ message.text }}
                </div>
              </li>
              <li v-else class="flex mx-4 h-8 justify-end my-2">
                <div class="bg-sky-400 rounded-full px-5 flex items-center">
                  <b>{{ message.emitter }}</b>
                  : {{ message.text }}
                </div>
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
    ...mapGetters(["getSocket", "getDataUser"]),
    sendMessage() {
      this.addMessage();

      this.text = "";
    },
    addMessage() {
      const message = {
        id: new Date().getTime(),
        text: this.text,
        emitter: this.currentUser,
        reciver: this.user,
      };

      this.messages = this.messages.concat(message);

      this.getSocket().socketInstance.emit("message", message);
    },
    getUser(dataUser) {
      this.user = dataUser.nickname;
      this.avatar = dataUser.avatar;
      this.description = dataUser.description;

      this.getSocket().socketInstance.emit("connect chat", {
        emitter: store.state.user.nickname,
        reciver: this.user,
      });

      this.getSocket().socketInstance.on("get messages", (data) => {
        this.messages = data;
        console.log(this.messages);
      });
    },
  },
  mounted() {
    this.getSocket().socketInstance.on("message:recived", (data) => {
      this.messages = this.messages.concat(data);
    });
  },
  beforeUnmount() {
    this.getSocket().socketInstance.emit(
      "exit user",
      store.state.user.nickname
    );
  },
  create() {
    this.getSocket().socketInstance.emit("start", store.state.user.nickname);
  },
};
</script>
