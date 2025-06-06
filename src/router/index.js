import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import EmployeeList from '../views/EmployeeList.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Logout from '../views/logout.vue'
import AdminDashboard from '../views/adminDashboard.vue'
import UserDashboard from '../views/userDashboard.vue'
import AddEmp from '../views/addEmp.vue'
import UpComingevent from '@/views/upComingevent.vue'
import Teammember from '@/views/Teammember.vue'
import Updateemploye from '@/views/updateemploye.vue'
import ProfileEmployee from '@/views/profile.vue'
import AnnouncmentUser from '@/views/announcment-user.vue'
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
    path: '/anouncment',
    component: AnnouncmentUser
  },
  {
    path: '/profile',
    name:'Profile_User',
    component: ProfileEmployee
  },
  {
    path: '/admindashboard',
    name:'adminDashboard',
    component: AdminDashboard
  },
  {
    path: '/admin/add',
    name:'addemp',
    component: AddEmp
   },
  {
    path: '/admin/update',
    name:'updateEmployes',
    component: Updateemploye
   },
  {
    path: '/userdashboard',
    name:'userDashboard',
    component: UserDashboard
  },

  {
    path: '/logout',
    name:'userLogout',
    component: Logout
  },
  {
    path: '/admin/view',
    name: 'EmployeeList',
    component: EmployeeList,
    meta: { requiresAuth: true }
  },
  
  {
    path: '/register',
    name: 'userRegister',
    component: Register
  },
  {
    path: '/upcoming',
    name: 'UpcomingEvents',
    component: UpComingevent
  },
  {
    path: '/teammember',
    name: 'Team_Member',
    component: Teammember
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