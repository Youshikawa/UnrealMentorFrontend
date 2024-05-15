<template>
  <div class="question-page">
    <el-card style="text-align: left;">
      <h1>{{ problem.title }}</h1>
      <el-divider></el-divider>
      <h3>题目描述</h3>
      <div class="description" v-html="md.render(problem.description)"></div>
      <h3>输入描述</h3>
      <div class="input_description description" v-html="md.render(problem.input_description)"></div>
      <h3>输出描述</h3>
      <div class="output_description description" v-html="md.render(problem.output_description)"></div>
      <h3>样例</h3>
      <div v-for="i in problem.sample" :key="i">
        <div class="sample description" v-html="md.render(i.input)"></div>
        <div class="sample description" v-html="md.render(i.output)"></div>
      </div>
    </el-card>
    <el-card>
      <el-form ref="answerForm" @submit.prevent="submitAnswer">
        <el-form-item label="编程语言">
          <el-select v-model="selectedLanguage" placeholder="请选择">
            <el-option label="C++" value="C++"></el-option>
            <el-option label="Python3" value="Python3"></el-option>
            <el-option label="Java" value="java"></el-option>
            <el-option label="C" value="C"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="答案">
          <el-input type="textarea" v-model="answer" autosize></el-input>
        </el-form-item>
        <el-form-item>
          <span v-if="judge_status.ac" class="ac-span"><h3>答案正确</h3>：恭喜你，答对了！！</span>
          <span v-if="judge_status.ce" class="ce-span"><h3>编译错误</h3>:你得程序没有通过编译器的编译，请检查是否语法错误</span>
          <span v-if="judge_status.wa" class="wa-span"><h3>答案错误</h3>：你的程序没有完全通过后台的测试点，请检查算法的正确性</span>
          <span v-if="judge_status.tle" class="tle-span">运行超时限：你的程序没有在规定的时间内运行结束，请检查程序的复杂度</span>
          <span v-if="hint_message!=null" class="ce-span" v-html="md.render(hint_message)" style="text-align:left"></span>
          
          <el-button type="primary" native-type="submit" :loading="submitting" @click.prevent="submitAnswer">提交</el-button>
          <el-button type="primary" native-type="submit" :loading="chating" style="background-color:#00bf10" v-if="judge_status.wa" @click.prevent="getHint">MentorGPT建议？</el-button>
          

          
        </el-form-item>
      </el-form>
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
      problem_id: this.$route.query.id,
      pid: 0,
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
      submission_id: 0,
      submitting: false,
      judge_status:{
        ac:false,
        wa:false,
        ce:false,
        re:false,
        tle:false,
      },
      hint_message:null,
    }
  },
  mounted() {
    let data = new FormData();
    data.append("pid", this.$data.problem_id);
    
    request.post('/oj/problem/', data, { headers: { 'Content-Type': 'application/json', } }).then((res) => {
      if (res.code === success) {
        this.$data.problem.title = res.data.title;
        this.$data.problem.description = res.data.description;
        this.$data.problem.input_description = res.data.input_description;
        this.$data.problem.output_description = res.data.output_description;
        this.$data.problem.sample = res.data.samples
        this.$data.pid = res.data.id
      } else if (res.code === failed) {
        console.log
      }
    })
  },
  methods: {
    submitAnswer() {
          this.submitting = true;
          let data = new FormData();
          this.$data.judge_status.ac = false;
          this.$data.judge_status.wa = false;
          this.$data.judge_status.ce = false;
          this.$data.judge_status.tle = false;
          
          data.append('code', this.$data.answer);
          data.append('lang', this.$data.selectedLanguage);
          data.append('pid', this.$data.pid);
          data.append('title', this.$data.problem.title);
          data.append('problem_description', this.$data.problem.description)
          if (!this.$data.answer) return;
          console.log(223)
          request.post('/oj/submit/', data, { headers: { 'Content-Type': 'application/json', } }).then((res) => {
            if (res.code == success) {
              this.$data.submission_id = res.submission_id;
              this.checkEvaluationResult();
            }
            this.submitting = false;
          })
        } ,
          checkEvaluationResult() {
          if (this.$data.submission_id) {
            // 向后端发送请求查询评测结果
            let data = new FormData();
          
            data.append('submission_id', this.$data.submission_id);
            request.post('/oj/results/', data, { headers: { 'Content-Type': 'application/json', } }).then(res => {
              // 处理评测结果
              // 假设后端返回的评测结果在 res.data.result 中
              console.log(res.data.data.result,"tle")

              if (res.data.data.result <= 1) {
                this.$data.submitting=false;
                if(res.data.data.result === 0) this.$data.judge_status.ac =true;
                if (res.data.data.result === -2) this.$data.judge_status.ce=true;
                if (res.data.data.result === 1) this.$data.judge_status.tle = true;
                if (res.data.data.result === -1) this.$data.judge_status.wa = true;
                // 将评测结果显示在页面上
                // 例如：this.$message.success(res.data.result);
              } else {
                this.$data.submitting=true;
                setTimeout(() => {
                  // 继续查询评测结果
                  this.checkEvaluationResult();
                }, 1000); // 每隔1秒查询一次评测结果
              }
            });
          }
        },
        getHint() {
          this.$data.chating = true;
          let data = new FormData();
          data.append('text', "这是题目" + this.$data.problem.description + '\n' + "这是我的程序" + this.$data.answer + "没有通过这个题目，MentorGPT可以给我什么意见么");
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
