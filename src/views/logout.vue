<template>
    <div class="logout-page">
      <p>Logging out...</p>
    </div>
  </template>
  
  <script>
  import authService from '../api/auth'
  
  export default {
  name:'userLogout',
    data() {
      return {}
    },
    mounted() {
      // Call logout logic and redirect
      authService.logout()
      this.$router.push('/')
    }
  }
  </script>
  
  <style scoped>
  .logout-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    font-size: 1.2rem;
    color: #555;
  }
  </style>
  