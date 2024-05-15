<template>
    <div id="app">
      <!-- 菜单栏 -->
      <el-header class="menu-header">
        <div class="menu-container">
          <el-menu
            :default-active="defaultActiveIndex"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#F9F9F9"
            text-color="#CFCF00"
            active-text-color="#CFCF00"
          >
            <el-menu-item index="1" @click="navigateTo('/problems')">题目列表</el-menu-item>
            <el-menu-item index="2" @click="navigateTo('/submission_list')">提交列表</el-menu-item>
          </el-menu>
        </div>
      </el-header>
  
      <!-- 表格 -->
      <el-table :data="problem" :key="problem.length" @row-click="ProblemClicked" row-style="cursor: pointer;" stripe>
        <el-table-column prop="_id" label="ID"></el-table-column>
        <el-table-column prop="title" label="标题" :formatter="formatTitle"></el-table-column>
        <el-table-column prop="created_by.username" label="创建者"></el-table-column>
        <el-table-column prop="difficulty" label="难度"></el-table-column>
        <el-table-column prop="submission_number" label="提交次数"></el-table-column>
        <el-table-column prop="accepted_number" label="通过次数"></el-table-column>
        <el-table-column prop="tags" label="标签" :formatter="formatTags"></el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  import request from "@/request/request";
  import { success } from "@/request/code";
  
  export default {
    name: "ProblemSet",
    data() {
      return {
        problem: [],
        defaultActiveIndex: "2", // 默认选中提交列表
      };
    },
    mounted() {
      request.get('/oj/problems/').then((res) => {
        console.log(res);
        if (res.code === success) {
          this.$data.problem = res.data;
        }
      });
    },
    methods: {
      ProblemClicked(row) {
        console.log(row);
        let id = row._id;
        this.$router.push({
          path: "/problem",
          query: {
            id: id,
          },
        });
      },
      navigateTo(path) {
        this.$router.push(path);
        if (path === '/problems') {
          this.defaultActiveIndex = '1';
        } else if (path === '/submission_list') {
          this.defaultActiveIndex = '2';
        }
      }
    },
  };
  </script>
  
  <style scoped>
  .menu-header {
    background-color: #fff;
    border-bottom: 1px solid #ebeef5;
  }
  
  .menu-container {
    justify-content: center;
  }
  
  .el-menu-demo {
    background-color: #F9F9F9;
    color: #CFCF00;
    line-height: 60px;
    border-bottom: none; /* 去掉下划线 */
  }
  </style>
  