<template>
  <div class="register-container">
    <h2>Register New Account</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label>Username</label>
        <input v-model="username" type="text" required>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" required>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
      <p>
        Already have an account? <router-link to="/">Login here</router-link>
      </p>
    </form>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'UserRegister',
  data() {
    return {
      username: '',
      password: '',
      error: '',
      success: '',
      loading: false
    }
  },
  methods: {
    async handleRegister() {
      this.loading = true
      this.error = ''
      this.success = ''

      // GraphQL mutation with variables for security
      const query = `
        mutation RegisterUser($username: String!, $password: String!) {
          register(username: $username, password: $password) {
            id
            username
          }
        }
      `

      try {
        const response = await axios.post('https://backendwithgo.onrender.com/graphql', {
          query,
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

        if (response.data.data.register) {
          this.success = 'Registration successful! Redirecting to login...'
          setTimeout(() => this.$router.push('/'), 1500)
        }
      } catch (err) {
        this.error = err.message || 'Registration failed. Please try again.'
        console.error('Registration error:', err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3aa876;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #ff4444;
  margin-top: 1rem;
}

.success {
  color: #00C851;
  margin-top: 1rem;
}

p {
  margin-top: 1.5rem;
  text-align: center;
}

a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>