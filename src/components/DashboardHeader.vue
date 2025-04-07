<template>
  <div class="user-dashboard">
    <!-- Header -->
    <header class="header">
      <div class="logo-container">
        <router-link to="/">
          <img src="../assets/workflow.png" class="logo" alt="Company Logo" />
        </router-link>
      </div>
      
      <nav class="nav-container">
        <RouterLink class="nav-link" to="/teammember">Team</RouterLink>
        <RouterLink class="nav-link" to="/upcoming">Events</RouterLink>
        <RouterLink class="nav-link" to="/anouncment">Announcements</RouterLink>

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
                My Profile
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
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Welcome Back!</h1>
        <p>Stay connected with your team, upcoming events, and important announcements.</p>
        <div class="hero-actions">
          <RouterLink to="/teammember" class="hero-button">
            View Team
          </RouterLink>
          <RouterLink to="/upcoming" class="hero-button secondary">
            Check Events
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
const clickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};

export default {
  name: 'UserDashboard',
  directives: {
    'click-outside': clickOutside,
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    closeDropdown() {
      this.showDropdown = false;
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      this.$router.push('/login');
      this.closeDropdown();
    }
  },
};
</script>

<style scoped>
.user-dashboard {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

.logo {
  height: 2.5rem;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #4b5563;
  font-weight: 500;
  padding: 0.5rem 0;
  text-decoration: none;
  position: relative;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #1e40af;
}

.router-link-exact-active {
  color: #1e40af;
}

.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1e40af;
}

/* Dropdown Styles */
.auth-dropdown {
  position: relative;
}

.auth-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  transition: all 0.2s ease;
}

.avatar:hover {
  border-color: #1e40af;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 3.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 12rem;
  overflow: hidden;
  z-index: 10;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  color: #4b5563;
  text-decoration: none;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
  color: #1e40af;
}

/* Transition Effects */
.dropdown-transition-enter-active,
.dropdown-transition-leave-active {
  transition: all 0.2s ease;
}

.dropdown-transition-enter-from,
.dropdown-transition-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh; /* Full viewport height */
  height: 100%;
  background: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') center center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin: 0;
  padding: 0;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(30, 64, 175, 0.8), rgba(49, 46, 129, 0.8));
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 48rem;
  padding: 0 2rem;
}

.hero-content h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-content p {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.hero-button {
  display: inline-block;
  background-color: white;
  color: #1e40af;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.hero-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.hero-button.secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.hero-button.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Main Content */
.main-content {
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
  
  .nav-container {
    width: 100%;
    justify-content: space-between;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>