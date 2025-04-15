<template>
  <!-- Template remains exactly the same as you have it -->
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-header">
        <h2>Welcome Back</h2>
        <p>Please enter your credentials to access your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter your username"
            required
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
            class="form-input"
          >
        </div>

        <router-link to="/forgot-password" class="forgot-password">
          Forgot password?
        </router-link>

        <button type="submit" :disabled="loading" class="login-button">
          <span v-if="!loading">Sign In</span>
          <span v-else class="button-loader"></span>
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>

        <div class="signup-link">
          Don't have an account? 
          <router-link to="/register" class="signup-text">Sign up</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import api from '../api/api'

export default {
  name: 'UserLogin',
  data() {
    return {
      username: '',
      password: '',
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
          login(username: $username, password: $password) {
            token
            user {
              id
              username
              isAdmin
            }
          }
        }
      `

      try {
        // 1. Make the API call
        const result = await api.queryGraphQL(graphqlMutation, {
          username: this.username,
          password: this.password
        })

        console.log('Login API response:', result) // Debug log

        // 2. Check for successful response
        if (!result || !result.login) {
          throw new Error('Invalid server response format')
        }

        // 3. Extract token and user data
        const { token, user } = result.login
        
        if (!token) {
          throw new Error('Authentication failed: No token received')
        }

        // 4. Store authentication data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        // 5. Prepare redirect path
        const redirectPath = user.isAdmin ? '/adminDashboard' : '/userDashboard'
        console.log('Authentication successful, redirecting to:', redirectPath)
        
        // 6. Navigate to dashboard
        this.$router.push(redirectPath)

      } catch (err) {
        // Enhanced error handling
        console.error('Login error details:', {
          error: err,
          request: {
            username: this.username,
            time: new Date().toISOString()
          },
          response: err.response?.data
        })

        // User-friendly error messages
        if (err.message.includes('Invalid credentials')) {
          this.error = 'Invalid username or password'
        } else if (err.message.includes('No token received')) {
          this.error = 'Authentication failed. Please try again.'
        } else {
          this.error = 'Login failed. Please try again later.'
        }

      } finally {
        this.loading = false
      }
    },
    
    // Optional: Test token immediately after login
    async verifyToken() {
      try {
        const query = `
          query {
            me {
              id
              username
              isAdmin
            }
          }
        `
        const response = await api.queryGraphQL(query)
        console.log('Token verification response:', response)
        return response.me
      } catch (err) {
        console.error('Token verification failed:', err)
        throw err
      }
    }
  }
}
</script>

<style scoped>
/* Your existing styles remain exactly the same */
:root {
  --primary-color: #4361ee;
  --primary-hover: #3a56d4;
  --text-color: #2b2d42;
  --light-gray: #f8f9fa;
  --border-color: #e9ecef;
  --error-color: #ef233c;
  --success-color: #06d6a0;
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--light-gray);
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--box-shadow);
  overflow: hidden;
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  color: var(--text-color);
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #6c757d;
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: var(--text-color);
  font-weight: 500;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
}

.forgot-password {
  font-size: 0.85rem;
  color: var(--primary-color);
  text-align: right;
  text-decoration: none;
  transition: var(--transition);
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  background-color: #4361ee;
  color: white;
  border: none;
  padding: 0.85rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
}

.login-button:hover {
  background-color: var(--primary-hover);
}

/* .login-button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
} */

.button-loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  color: var(--error-color);
  font-size: 0.9rem;
  text-align: center;
  margin: 0.5rem 0;
}

.signup-link {
  text-align: center;
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 1rem;
}

.signup-text {
  color: var(--primary-color);
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition);
}

.signup-text:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem;
  }
  
  .login-header h2 {
    font-size: 1.5rem;
  }
}
</style>