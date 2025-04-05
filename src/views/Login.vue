<template>
  <div class="login-container">
    <h2>Employee Portal Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Username</label>
        <input v-model="username" type="text" required>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" required>
      </div>
      <p>
        Don't have an account? <router-link to="/register">Register here</router-link>
      </p>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserLogin',
  data() {
    return {
      username: 'Gordon',
      password: '64382',
      error: '',
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = ''

      const graphqlMutation = `
        mutation LoginUser($username: String!, $password: String!) {
          login(username: $username, password: $password)
        }
      `

      try {
        const response = await axios.post('http://localhost:8080/graphql', {
          query: graphqlMutation,
          variables: {
            username: this.username,
            password: this.password
          }
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.data.errors) {
          throw new Error(response.data.errors[0].message)
        }

        const token = response.data.data.login
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        this.$router.push('/employees')
        
      } catch (err) {
        this.error = err.message || 'Login failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Your existing styles */
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.form-group {
  margin-bottom: 1rem;
}
.error {
  color: red;
}
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>