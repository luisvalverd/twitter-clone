<template>
  <div class="h-full">
    <div v-if="!joined">
      <button @click="join">Join Chat</button>
    </div>
    <div v-if="joined" class="h-full">
      <div class="container flex h-full border-r-2 border-l-2">
        <section class="w-1/4 h-full border-r-2">
          <ChatUsers></ChatUsers>
        </section>
        <section class="w-3/4 flex flex-col justify-between h-full">
          <div class="h-12 flex items-center border-b-2">
            <h1 class="mx-4">Chat</h1>
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
import io from "socket.io-client";
import store from "../store/index";
import ChatUsers from "../components/ChatUsers.vue";

export default {
  name: "Chat",
  data() {
    return {
      joined: false,
      currentUser: store.state.user.nickname,
      text: "",
      messages: [],
    };
  },
  components: {
    ChatUsers,
  },
  methods: {
    join() {
      this.joined = true;
      this.socketInstance = io("http://localhost:5000");

      this.socketInstance.on("message:recived", (data) => {
        this.messages = this.messages.concat(data);
      });
    },
    sendMessage() {
      this.addMessage();

      this.text = "";
    },
    addMessage() {
      const message = {
        id: new Date().getTime(),
        text: this.text,
        user: this.currentUser,
      };

      this.messages = this.messages.concat(message);
      console.log(this.messages);

      this.socketInstance.emit("message", message);
    },
  },
};
</script>
