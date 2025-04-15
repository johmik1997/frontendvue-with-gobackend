import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import axios from 'axios'

// Configure axios
axios.defaults.baseURL = 'https://backendwithgo.onrender.com/'
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const app = createApp(App)
app.use(Toast)
app.use(createPinia())
app.use(router)
app.mount('#app')