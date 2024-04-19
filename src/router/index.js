import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/views/LoginPage.vue'
import register from '@/views/RegisterPage.vue'
import chat from '@/views/ChatPage.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path:'/login',
    name:'login',
    component:Login
  },
  {
    path:'/register',
    name:'register',
    component:register
  },
  {
    path:'/chat',
    name:'chat',
    component:chat,
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
