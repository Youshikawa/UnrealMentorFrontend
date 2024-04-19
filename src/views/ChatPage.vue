<template>
    <div class="chat-container">
      <div class="login-reminder" v-if = "login_remember">
        系统发生了错误：请检查是否登入，或者管理人员/ Please check login.
      </div>
      <div class="message-container">
      <div v-for="(message, index) in messages" :key="index" class="message" :class="{ 'user-message': message.sender === 'user', 'chatgpt-message': message.sender === 'chatgpt' }">
        <div v-html="md.render(message.text)" />
      </div>
      </div>  
      <div class="input-container">
        <input class = "input-container-texta" v-model="userMessage" @keyup.enter="sendMessage" placeholder="Type your message...">
      </div>
    </div>
  </template>
  
  <script>
  import { success, failed } from '@/request/code';
import request from '@/request/request'
import md from '@/request/markdown'
// import { defineComponent } from 'vue';

  import {ref} from 'vue';
  export default {
    data() {
      return {
        userMessage: '',
        messages: [],
        text:ref("Heelp"),
        conversation_id: -1,
        md:md,
        login_remember: false,
      };
    },
    methods: {
      sendMessage() {
        // 将用户消息添加到消息列表
        this.messages.push({ sender: 'user', text: this.userMessage });
        // 发送用户消息到ChatGPT并获取回复
        this.getChatGPTResponse(this.userMessage);
        // 清空用户输入框
        this.userMessage = '';
      },
      getChatGPTResponse(message) {
        // 这里你可以实现发送用户消息到ChatGPT的逻辑
        // 并获取ChatGPT的回复，将其添加到消息列表中
        // 以下是一个简单的示例，假设ChatGPT直接返回用户输入
        let data = new FormData();
        if (this.$data.conversation_id != -1) data.append('conversation_id', this.$data.conversation_id);
        data.append('text', this.$data.userMessage);
        request.post('/chatapi/post_chat/', data, {headers:{'Content-Type': 'application/json',}}).then((res) => {
            if (res.code === success) {
              this.$data.conversation_id = res.conversation_id;
              message = res.text;
              this.$data.messages.push({ sender: 'chatgpt', text: message });
            } else if (res.code === failed) {
              this.$data.login_remember = true;
            }
        })
        
      }
    }
  };
  </script>
  
<style scoped>
.chat-container {
  margin: auto;
  max-width: 900px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* 让消息框在底部 */
  height: 80vh; /* 限制聊天框的高度 */
}

.message-container {
  max-height: 80vh; /* 设置消息容器的最大高度 */
  flex-direction: column;
  display: flex;
  overflow-y: auto; /* 添加垂直滚动条 */
}

.message {
  background-color: #f3f3f3;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  max-width: 70%;
}

.chatgpt-message {
  align-self: flex-start; /* GPT消息左对齐 */
  text-align: left;
}

.user-message {
  align-self: flex-end; /* 用户消息右对齐 */
  background-color: #e2f5fe;
}

.input-container {
  margin-top: 20px;
}

.input-container-texta {
  background-color: rgb(240, 240, 246);
  transition: all 400ms ease-in-out 0s;
  padding: 10px;
  border-radius: 100vh;
  border: none;
  outline-color: white;
}

.input-container-texta:hover {
  outline-color: #c4b8ff;
  outline-width: 0.2px;
}
.login-reminder {
    background-color: #f8d7da;
    color: #721c24;
    padding: 10px 20px;
    border-radius: 5px;
    border: 1px solid #f5c6cb;
    margin: 20px;
    text-align: center;
  }

  /* 可选：给提示框添加动画效果 */
  .login-reminder {
    animation: fadeInOut 0.78s ease-in-out infinite alternate;
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
input {
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>