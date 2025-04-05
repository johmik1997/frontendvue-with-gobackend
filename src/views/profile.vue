<template>
    <div class="profile-page">
      <h2>My Profile</h2>
  
      <div v-if="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
  
      <div v-else class="profile-card">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Full Name:</strong> {{ user.fullName }}</p>
        <!-- Add more fields as needed -->
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'Profile',
    data() {
      return {
        user: {},
        loading: false,
        error: null
      }
    },
    async mounted() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8080/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.user = response.data
      } catch (err) {
        this.error = 'Failed to load profile information'
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
  </script>
  
  <style scoped>
  .profile-page {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
  }
  .profile-card {
    border: 1px solid #ccc;
    padding: 1.5rem;
    border-radius: 8px;
    background-color: #fafafa;
  }
  .error {
    color: red;
  }
  </style>
  