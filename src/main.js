import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import  {MdEditor}  from 'md-editor-v3'
import 'element-plus/dist/index.css'
// import axios from 'axios'
// import VueAxios from 'vue-axios'
// axios.defaults.baseURL='http://150.158.146.160:8000'
createApp(App)
// .use(VueAxios, axios)
.use(store)
.use(router)
.use(ElementPlus)
.use(MdEditor)
.mount('#app')
