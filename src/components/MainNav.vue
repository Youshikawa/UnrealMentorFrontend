<template>
    <div class="header">
      <el-row>
        <el-col :span="4">
          <div class="logo" @click="handleLogoTextClicked">
            <img src="@/assets/logo.png" alt="logo" height="100%">

          </div>
        </el-col>
        <el-col :span="10 + navLen" :offset="10" style="right: 0">
          <div class="nav">
            <el-menu mode="horizontal" :router="true" :default-active="$route.path" class="menu-custom-style">
              <el-menu-item index="/">首页</el-menu-item>
              <el-menu-item index="/new">社区</el-menu-item>
              <el-menu-item index="/chat">智能问答</el-menu-item>
              <el-menu-item index="/problems">智能题库</el-menu-item>
              <el-menu-item  v-if="!token" index="/login" style="text-decoration: none " disabled>
              <button class = "login_button" @click="to_login" v-if="is_login === false">登录</button>
              <button class = "register_button" @click="to_register" v-if="is_login === false" >注册</button>
                </el-menu-item>
        <el-col class = "useritem" :span="1 - navLen">
         <div v-if="is_login === true" style="padding-left: 1em;">
           <el-dropdown   class = "useritem">
             <span class="el-dropdown-link logo">
               <div>
                 {{username}}
               </div>
               <el-icon class="el-icon&#45;&#45;right">
                 <arrow-down/>
               </el-icon>
             </span>
             <template #dropdown>
               <el-dropdown-menu>
                 <el-dropdown-item @click="handleNewArticleClicked">新建文章</el-dropdown-item>
                 <el-dropdown-item @click="handleAdmin">后台管理</el-dropdown-item>
                 <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
               </el-dropdown-menu>
             </template>
           </el-dropdown>
         </div>
       </el-col>
            </el-menu>
          </div>
        </el-col>
       
      </el-row>
    </div>
  </template>
  
  <script>
  import {ElRow, ElCol, ElMenu, ElMenuItem, ElMessageBox} from "element-plus";
//   import JsCookie from "js-cookie";
import { success, failed } from '@/request/code';
import request from '@/request/request'
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Nav",
    components: {
      ElRow,
      ElCol,
      ElMenu,
      ElMenuItem,
    },
    data() {
      return {
        token: "",
        username: "admin",
        navLen: 0,
        is_login:1,
      }
    },
    mounted() {

      request.get('/user/status/').then((res) => {
        if (res.code === success) {
          this.is_login = true;
          this.username = res.username
        } else if (res.code === failed){
          this.is_login = false;
        }
      })
    },
    methods: {
      to_login() {
        this.$router.push({name:"login"});
      },
      to_register() {
        this.$router.push({name:"register"});
      },
      handleLogout() {
        ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = new FormData();
          request.post('/user/logout/', data, {headers:{'Content-Type': 'application/json',}});
          location.reload();
          // 确定退出登录，执行相关逻辑
        }).catch(() => {
          // 取消退出登录，不需要执行任何逻辑
        })
      },
      handleNewArticleClicked(){
        this.$router.push({path: '/change'});
      },
      handleLogoTextClicked(){
        this.$router.push({
          path: '/',
        })
      },
      handleAdmin(){
        this.$router.push({
          path: '/admin',
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .header {
    background-color: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }
  
  .logo {
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  img {
    margin-top: -10px;
    height: 60px;
  }
  
  
  .nav {
    height: 64px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  
  .el-menu.el-menu--horizontal {
  
  }
  .useritem{
    border: none;
  }
  .useritem:hover{
    border: none;
  }
  .menu-custom-style{
    border-bottom: solid 0px var(--el-menu-border-color)!important;
    width: 100%;
  }
  
  /*.menu-custom-style .el-menu-item {*/
  /*  background-color: transparent;*/
  /*  border-color: transparent;*/
  /*}*/
  /*.menu-custom-style .el-menu-item:hover {*/
  /*  text-decoration: none;*/
  /*}*/
  
  .login-btn {
    margin-left: auto;
    color: #333;
    font-weight: bold;
    border-color: #333;
    border-color: transparent;
  }
  .login_button {
    border: none;
    display: inline-block;
    padding: 10px 20px;
    border-radius: 30px; /* 控制圆角半径 */
    background-color: #2415ff; /* 深蓝色背景 */
    color: #ffffff; /* 文字颜色为白色 */
    text-align: center;
    text-decoration: none;
    transition: background-color 0.3s ease; /* 添加颜色过渡效果 */
}

.login_button:hover {
    background-color: #00078d; /* 悬停时的深色背景 */
    cursor: pointer;
}
.register_button {
    
    border: none;
    display: inline-block;
    margin:10px;
    padding: 10px 20px;
    border-radius: 30px; /* 控制圆角半径 */
    background-color: #2415ff; /* 深蓝色背景 */
    color: #ffffff; /* 文字颜色为白色 */
    text-align: center;
    text-decoration: none;
    transition: background-color 0.3s ease; /* 添加颜色过渡效果 */
}

.register_button:hover {
    background-color: #00078d; /* 悬停时的深色背景 */
    cursor: pointer;
}
  .logo:hover{
    cursor: pointer;
  }
  </style>
  <!--<template>-->
  <!--  <el-menu-->
  <!--      :router="true"-->
  <!--      text-color="#606266"-->
  <!--      active-text-color="#2F74FF"-->
  <!--      default-active="¥route.path"-->
  <!--      mode="horizontal"-->
  <!--      style="overflow-x: auto;height: 4em;flex-direction: row-reverse"-->
  <!--      class="el-menu-demo"-->
  <!--      ellipsis="false"-->
  <!--  >-->
  
  <!--    <el-menu-item-->
  <!--        index="/mainPage"-->
  <!--    >-->
  <!--      <div>首页</div>-->
  <!--    </el-menu-item>-->
  <!--    <el-menu-item-->
  <!--        index="/new"-->
  <!--    >-->
  <!--      <div>最新政策</div>-->
  <!--    </el-menu-item>-->
  <!--    <el-menu-item-->
  <!--        index="/search"-->
  <!--    >-->
  <!--      <div>检索政策</div>-->
  <!--    </el-menu-item>-->
  <!--  </el-menu>-->
  <!--</template>-->
  
  <!--<script>-->
  <!--export default {-->
  <!--  name: "MainNav",-->
  <!--  data(){-->
  <!--    return {-->
  
  <!--    }-->
  <!--  }-->
  <!--}-->
  <!--</script>-->
  
  <!--<style scoped>-->
  <!--.flex-grow {-->
  <!--  flex-grow: 1;-->
  <!--  width: 20%;-->
  <!--}-->
  <!--</style>-->