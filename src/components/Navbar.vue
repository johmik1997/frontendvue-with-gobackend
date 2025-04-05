<template>
  <div class="header">
    <div class="logo-container">
      <router-link to="/">
        <img src="../assets/workflow.png" class="logo" alt="Logo" />
      </router-link>
    </div>
    <div class="nav-container">
      <div class="auth-dropdown">
        <button class="auth-button" @click.stop="toggleDropdown">
          <span class="dropdown-icon">
            <img src="../assets/avater.png" class="avater" />
          </span>
        </button>
        <transition name="fade">
          <div v-if="showDropdown" class="dropdown-menu" v-click-outside="closeDropdown">
            <RouterLink to="/login" class="dropdown-item" @click="closeDropdown">Login</RouterLink>
            <RouterLink to="/register" class="dropdown-item" @click="closeDropdown">Register</RouterLink>
          </div>
        </transition>
      </div>
    </div>
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
  name: 'AppHeader',
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
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  width: auto;
}

.nav-container {
  display: flex;
  align-items: center;
}

.auth-dropdown {
  position: relative;
  display: inline-block;
}

.auth-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.auth-button:hover {
  color: #0066ff;
}

.avater {
  height: 30px;
  width: 30px;
  border-radius: 50%;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 5px);
  background-color: white;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1001;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #333;
  font-size: 0.9rem;
  text-align: left;
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
  color: #0066ff;
}

.router-link-exact-active {
  color: #0066ff;
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>