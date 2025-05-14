<script setup lang="ts">
const { $socket } = useNuxtApp();
const cid = "chat-room-id"; // your conversation ID
const message = ref("");
const messages = ref<string[]>([]);

onMounted(() => {
  $socket.emit("joinConversation", cid);

  $socket.on("joinedConversation", (roomId) => {
    console.log("Joined:", roomId);
  });

  $socket.on("newMessage", (msg) => {
    messages.value.push(msg); // 👈 Add the message sent from backend

    console.log("New message:", msg);
  });
});

const sendMessage = () => {
  $socket.emit("sendMessage", {
    cid,
    text: message.value,
  });
  message.value = "";
};
</script>

<template>
  <div>
    <input v-model="message" placeholder="Type your message..." />
    <button @click="sendMessage">Send</button>
    <div v-for="msg in messages" :key="msg" class="message">
      <p>{{ msg }}</p>
    </div>
  </div>
</template>
