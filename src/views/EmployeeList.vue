<template>

  <div class="employee-list">
    <userHeader/>
    <h2>Employee Details</h2>
    <button @click="logout" class="logout-btn">Logout</button>
    
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else>
      <div v-for="emp in employees" :key="emp.id" class="employee-card">
        <h3>{{ emp.title }}</h3>
        <p><strong>ID:</strong> {{ emp.id }}</p>
        <p><strong>Address:</strong> {{ emp.address || 'Not available' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import userHeader from '../components/usernavbar.vue'
import api from '../api/api'
import authService from '../api/auth'

export default {
  components: {
    userHeader
  },
  data() {
    return {
      employees: [],
      loading: false,
      error: null
    }
  },
  async created() {
    try {
      this.loading = true
      const data = await api.queryGraphQL(`
        {
          EmployeeDetails {
            id
            title
            address
          }
        }
      `)
      this.employees = data.EmployeeDetails
    } catch (err) {
      this.error = 'Failed to load employee data'
      console.error('Error:', err)
    } finally {
      this.loading = false
    }
  },
  methods: {
    logout() {
      authService.logout()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.employee-list {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}
.employee-card {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
}
.logout-btn {
  float: right;
  background: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.error {
  color: red;
}
</style>