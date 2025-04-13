<template>
    <nav class="navbar">
      <div class="navbar-left">
        <RouterLink to="/" class="logo-link">
          <img src="../assets/workflow.png" class="logo" alt="Company Logo" />
        </RouterLink>
        <span class="dashboard-title">Admin Dashboard</span>
      </div>
      <div class="navbar-right">
        <RouterLink
          v-for="link in adminLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          active-class="active-link"
        >
          {{ link.name }}
        </RouterLink>
        
        <div class="auth-dropdown">
          <button class="auth-button" @click.stop="toggleDropdown">
            <img src="../assets/avater.png" class="avatar" alt="User Avatar" />
          </button>

          <transition name="dropdown-transition">
            <div 
              v-if="showDropdown" 
              class="dropdown-menu" 
              v-click-outside="closeDropdown"
            >
              <RouterLink 
                class="dropdown-item" 
                to="/profile" 
                @click="closeDropdown"
              >
                Profile
              </RouterLink>
              <button 
                class="dropdown-item" 
                @click="logout"
              >
                Logout
              </button>
            </div>
          </transition>
        </div>
      </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showDropdown = ref(false)

const adminLinks = ref([
  { name: 'Add Employee', path: '/admin/add' },
  { name: 'View Employees', path: '/admin/view' },
  { name: 'Update Employee', path: '/admin/update' }

])

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function closeDropdown() {
  showDropdown.value = false
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  router.push('/login')
  closeDropdown()
}
//</script>
console,console.log('Admin Dashboard Loaded',clickoutdidr);

//<script> 
// Click Outside Directive
const clickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

export default {
  name: 'adminNavbar',
  directives: {
    'click-outside': clickOutside
  }
}
</script>

<style scoped>
/* Base Styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2c3e50;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 40px;
  width: auto;
}

.dashboard-title {
  font-size: 1.2rem;
  font-weight: 600;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-link:hover, .active-link {
  background-color: #34495e;
}

.auth-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ecf0f1;
}

.auth-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  overflow: hidden;
  z-index: 1001;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  text-align: left;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

/* Dropdown Transition */
.dropdown-transition-enter-active,
.dropdown-transition-leave-active {
  transition: all 0.3s ease;
}

.dropdown-transition-enter-from,
.dropdown-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .navbar {
    padding: 0.75rem 1rem;
    flex-direction: column;
    align-items: stretch;
  }

  .navbar-left {
    justify-content: space-between;
    padding: 0.5rem 0;
  }

  .navbar-right {
    flex-direction: column;
    gap: 0;
    width: 100%;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .navbar-right.show {
    max-height: 500px; /* Adjust based on your content */
    padding: 0.5rem 0;
  }

  .nav-link {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .auth-dropdown {
    width: 100%;
  }

  .dropdown-menu {
    position: static;
    width: 100%;
    box-shadow: none;
    border-radius: 0;
  }

  /* Mobile Menu Toggle Button (add this to your template) */
  .mobile-menu-toggle {
    display: block;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }
}
</style>