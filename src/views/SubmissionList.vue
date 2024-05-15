<template>
  <div id="app">
    <!-- 菜单栏 -->
    <el-header class="menu-header">
      <div class="menu-container">
        <el-menu
        :default-active="2"
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
    <el-table :data="submissions" :key="submissions.length" @row-click="ItemClicked" row-style="cursor: pointer;" stripe>
      <el-table-column prop="submission_id" label="ID"></el-table-column>
      <el-table-column prop="problem_name" label="题目" :formatter="formatTitle"></el-table-column>
      <el-table-column prop="user" label="创建者"></el-table-column>
      
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
      submissions: [],
      defaultActiveIndex: "1", // 默认选中题目列表
    };
  },
  mounted() {
    request.get('/oj/submission_list/').then((res) => {
      console.log(res);
      if (res.code === success) {
        this.$data.submissions = res.data;
      }
    });
  },
  methods: {
    ItemClicked(row) {
      console.log(row);
      let id = row.submission_id;
      this.$router.push({
        path: "/submission",
        query: {
          id: id,
        },
      });
    },
    navigateTo(path) {
      this.$router.push(path);
      if (path === '/problem_list') {
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
  background-color: #fff;
  color: #000;
  line-height: 60px;
  border-bottom: none; /* 去掉下划线 */
}
</style>
