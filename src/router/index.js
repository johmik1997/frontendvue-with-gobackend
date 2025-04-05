import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import EmployeeList from '../views/EmployeeList.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Logout from '../views/logout.vue'
const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: Home
  },
  {
    path: '/login',
    name:'UserLogin',
    component: Login
  },
  {
    path: '/logout',
    name:'userLogout',
    component: Logout
  },
  {
    path: '/employees',
    name: 'EmployeeList',
    component: EmployeeList,
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'userRegister',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next('/')
  } else {
    next()
  }
})

export default router