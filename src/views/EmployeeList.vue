<template>
  <div class="employee-list fantasy-scroll">
    <h2 class="fantasy-title">Guild Members' Records</h2>
    <div v-if="loading" class="fantasy-loading">Summoning data from the archives...</div>
    <div v-else-if="error" class="fantasy-error">⚠️ A dark force blocks our path: {{ error }}</div>
    
    <div v-else>
      <div v-for="(group, department) in groupedEmployees" :key="department" class="department-group">
        <h3 class="department-title">🏰 Order of {{ department || 'Mysterious Ones' }}</h3>
        <div class="department-members">
          <div v-for="emp in group" :key="emp.id" class="employee-card enchanted-card">
            <div class="member-header">
              <h4 class="member-name">🧙 {{ emp.empName }}</h4>
              <span class="member-rank">{{ emp.experience || '0' }} seasons</span>
            </div>
            <div class="member-details">
              <p><strong>Guild ID:</strong> {{ emp.empId }}</p>
              <p><strong>Realm:</strong> {{ emp.address || 'Hidden domain' }}</p>
              <p><strong>Moonbirth:</strong> {{ formatDate(emp.birthdate) || 'Unknown cycle' }}</p>
            </div>
            <div v-if="emp.employePhoto" class="member-portrait">
              <img :src="emp.employePhoto" alt="Member portrait" class="enchanted-photo">
            </div>
            <button @click="viewDetails(emp.id)" class="enchanted-button">
              🔍 View Scroll
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/api'
import authService from '../api/auth'

export default {
  data() {
    return {
      employees: [],
      loading: false,
      error: null
    }
  },
  computed: {
    groupedEmployees() {
      const groups = {}
      this.employees.forEach(emp => {
        const dept = emp.department || 'Ungrouped'
        if (!groups[dept]) {
          groups[dept] = []
        }
        groups[dept].push(emp)
      })
      return groups
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
        this.error = err.message
        console.error('API Error:', err)
        
        if (err.message.includes('Session expired')) {
          this.logout()
        }
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'Unknown'
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
          return dateString
        }
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch {
        return dateString
      }
    },
    viewDetails(id) {
      this.$router.push(`/employee/${id}`)
    },
    logout() {
      authService.logout()
      this.$router.push('/')
    }
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

.fantasy-loading {
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
  text-align: center;
}

.department-group {
  margin-bottom: 2.5rem;
  border-bottom: 2px dashed #c2a36b;
  padding-bottom: 1.5rem;
}

.department-group:last-child {
  border-bottom: none;
}

.department-title {
  color: #5b3c11;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
  border-left: 4px solid #8b5a2b;
}

.department-members {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.employee-card {
  background: rgba(255, 248, 230, 0.8);
  border: 2px solid #b8860b;
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.employee-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(210, 180, 140, 0.4);
}

.member-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  border-bottom: 1px dashed #c2a36b;
  padding-bottom: 0.5rem;
}

.member-name {
  color: #5b3c11;
  font-size: 1.2rem;
  margin: 0;
}

.member-rank {
  background: #8b5a2b;
  color: #f4f1e1;
  padding: 0.2rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
}

.member-details {
  flex-grow: 1;
  margin-bottom: 1rem;
}

.member-details p {
  margin: 0.3rem 0;
  font-size: 0.95rem;
}

.member-portrait {
  margin: 0.5rem 0;
  display: flex;
  justify-content: center;
}

.enchanted-photo {
  max-width: 100%;
  max-height: 120px;
  border: 3px solid #cfa45e;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(210, 180, 140, 0.6);
}

.enchanted-button {
  background: linear-gradient(to bottom, #8b5a2b, #5b3c11);
  color: #f4f1e1;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: 'MedievalSharp', cursive;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  align-self: flex-start;
}

.enchanted-button:hover {
  background: linear-gradient(to bottom, #9c6b33, #6c4d22);
  box-shadow: 0 0 10px rgba(210, 180, 140, 0.7);
}
</style>