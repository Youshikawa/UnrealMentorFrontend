<template>

<!--  <img src="./assets/logo.png">-->
<!--  <div>-->
<!--    <p>-->
<!--      If Element Plus is successfully added to this project, you'll see an-->
<!--      <code v-text="'<el-button>'"></code>-->
<!--      below-->
<!--    </p>-->
<!--    <el-button type="primary">el-button</el-button>-->
<!--  </div>-->
<!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  <MainNav></MainNav>
  <router-view/>
</template>

<script>
// import HomeView from './views/HomeView.vue'
import MainNav from "@/components/MainNav.vue";
export default {
  name: 'App',
  components: {
    MainNav,

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  //margin-top: 60px;
}
MainNav{
  top: -2em;
  width: 100%;
  height: 100%;
}
</style>
