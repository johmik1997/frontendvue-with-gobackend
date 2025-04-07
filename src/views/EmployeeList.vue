<template>
  <div class="employee-list fantasy-scroll">
    <h2 class="fantasy-title">Guild Members' Records</h2>    
    <div v-if="loading" class="fantasy-loading">Summoning data from the archives...</div>
    <div v-else-if="error" class="fantasy-error">⚠️ A dark force blocks our path: {{ error }}</div>
    
    <div v-else>
      <div v-for="emp in employees" :key="emp.id" class="employee-card enchanted-card">
        <h3 class="member-name">🧙 {{ emp.empName }}</h3>
        <p><strong>Guild ID:</strong> {{ emp.empId }}</p>
        <p><strong>Order:</strong> {{ emp.department || 'Unknown Order' }}</p>
        <p><strong>Years of Mastery:</strong> {{ emp.experience || 'Mysterious past' }} years</p>
        <p><strong>Realm of Residence:</strong> {{ emp.address || 'Hidden realm' }}</p>
        <p><strong>Moonbirth:</strong> {{ formatDate(emp.birthdate) || 'Unknown cycle' }}</p>
        <p v-if="emp.employePhoto">
          <strong>Portrait:</strong> 
          <img :src="emp.employePhoto" alt="Employee portrait" class="employee-photo enchanted-photo">
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/api'

export default {
  data() {
    return {
      employees: [],
      loading: false,
      error: null
    }
  },
  async created() {
    await this.fetchEmployees()
  },
  methods: {
    async fetchEmployees() {
      try {
        this.loading = true
        this.error = null
        const data = await api.queryGraphQL(`
          query {
            employeeDetails {
              id
              empId
              empName
              department
              experience
              address
              birthdate
              employePhoto
            }
          }
        `)
        this.employees = data.employeeDetails || []
      } catch (err) {
        this.error = err.message || 'Failed to load employee data'
        console.error('Error:', err)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return null
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');

.fantasy-scroll {
  font-family: 'MedievalSharp', cursive;
  background: #f4f1e1;
  border: 2px solid #c2a36b;
  border-radius: 15px;
  padding: 2rem;
  max-width: 900px;
  margin: 3rem auto;
  box-shadow: 0 0 15px rgba(190, 166, 102, 0.6);
}

.fantasy-title {
  text-align: center;
  font-size: 2rem;
  color: #5b3c11;
  margin-bottom: 2rem;
  text-shadow: 1px 1px #c6b179;
}

.fantasy-loading,
.fantasy-error {
  text-align: center;
  font-size: 1.2rem;
  color: #7c2d12;
}

.fantasy-error {
  color: #a80f0f;
  font-weight: bold;
  border: 1px solid #a80f0f;
  background-color: #fdecea;
  padding: 1rem;
  border-radius: 8px;
}

.employee-card {
  background: #fff8e6;
  border: 2px dashed #cfa45e;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 10px rgba(210, 180, 140, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.employee-card:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(223, 191, 130, 0.6);
}

.member-name {
  color: #3a240d;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.employee-photo {
  display: block;
  margin-top: 0.5rem;
  max-width: 120px;
  max-height: 120px;
  border: 3px solid #cfa45e;
  border-radius: 10px;
  box-shadow: 0 0 6px #dec28a;
}

.enchanted-photo {
  filter: brightness(1.1) contrast(1.05) saturate(1.2);
}
</style>
