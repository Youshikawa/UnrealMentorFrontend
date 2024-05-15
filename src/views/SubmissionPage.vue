<template>
    <div class="question-page">
      <el-card style="text-align: left;">
        <h1>{{ problem.title }}</h1>
        <el-divider></el-divider>
        <h3>题目描述</h3>
        <div class="description" v-html="md.render(problem.description)"></div>

        <h3>提交程序</h3>
    

        <div class="input_description description" v-html="md.render(submission.code)"></div>
        <el-button @click.prevent="getHint" :loading="chating">MentorGPT解释代码？</el-button>
        <div v-if="hint_message!=null" v-html=md.render(hint_message)>

</div>
        <h3>运行结果</h3>
        <div class="input_description description" >{{submission.status}}</div>
        
      </el-card>
      
    </div>
  </template>
  
  <script>
  import { success, failed } from '@/request/code';
  import request from '@/request/request'
  import md from '@/request/markdown'
  export default {
    name: 'app',
    data() {
      return {
        submission_id: this.$route.query.id,
        pid: 0,
        submission:{
            code:"",
            status:0,
        },
        problem: {
          title: "题目标题",
          description: "题目描述",
          input_description: "输入描述1",
          output_description: "输出描述1",
          sample: [],
        },
        chating:false,
        selectedLanguage: "C++",
        answer: "",
        md: md,
        submitting: false,

        hint_message:null,
      }
    },
    mounted() {
      let data = new FormData();
      data.append("submission_id", this.$data.submission_id);
      let dictstatus = {
        "0":"答案正确",
        "-1":"答案错误",
        "-2":"编译错误",
        "1":"运行超时",
      }
      request.post('/oj/results/', data, { headers: { 'Content-Type': 'application/json', } }).then((res) => {
        if (res.code === success) {
          this.$data.submission.code = "```\n" + res.data.data.code + "\n```\n";
          this.$data.submission.status = dictstatus[res.data.data.result];
          this.$data.problem.description = res.problem_content;
          this.$data.problem.title = res.title;
        } else if (res.code === failed) {
          console.log
        }
      })
    },
    methods: {
          getHint() {
            this.$data.chating = true;
            let data = new FormData();
            data.append('text', "这是题目" + this.$data.problem.description + '\n' + "这是我的程序" + this.$data.submission.code + "请解释一下这个程序为什么" +this.$data.submission.status+ "并用自然语言解释这个程序！");
            request.post('/chatapi/post_chat/', data, {headers:{'Content-Type': 'application/json',}}).then((res) => {
              if (res.code === success) {
                this.$data.hint_message = "<h3>MentorGPT</h3>" + res.text;
                this.$data.chating = false;
                
              } 
          })
          }
      }
          
    }
  </script>
  
  <style scoped>
  .question-page {
    max-width: 800px;
    margin: 0 auto;
  }
  .description {
    text-align: left;
  }
  /* judge_status span */
  .ac-span {
    display: inline-block;
    width:200%;
    padding: 5px 10px;
    background-color: #00bf10; /* Blue background */
    color: white;
    border-radius: 4px;
    transform: scale(0.8);
    width:200vh;
  
    animation:loading 0.5s;
  
  }
  .wa-span {
    display: inline-block;
    padding: 5px 10px;
    background-color: #ea0000; /* Blue background */
    color: white;
    border-radius: 4px;
    transform: scale(0.8);
    width:200vh;
  
    animation: loading 0.5s;
  
  }
  .ce-span {
    display: inline-block;
    padding: 5px 10px;
    background-color: rgb(0, 127, 191); /* Blue background */
    color: white;
    border-radius: 4px;
    transform: scale(0.8);
    width:200vh;
    
    animation:loading 0.5s;
  
  }
  .tle-span {
    display: inline-block;
    padding: 5px 10px;
    background-color: #e5e500; /* Blue background */
    color: white;
    border-radius: 4px;
    transform: scale(0.8);
    width:200vh;
  
    animation: loading 0.5s;
  }
  @keyframes loading {
    0% {
      opacity: 0.5;
      transform: scale(1);
      text:"正在评测."
    }
    50% {
      opacity: 0.8;
      transform: scale(0.9);
      text:"正在评测.."
    }
    100% {
      opacity: 1;
      transform: scale(0.8);
      text:"正在评测..."
    }
  }
  </style>
  