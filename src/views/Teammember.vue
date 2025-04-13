<template>
  <div class="fantasy-guild-hall">
    <h2 class="guild-title">⚔️ Guild Roster ⚔️</h2>
    
    <div v-if="loading" class="spellcasting">
      <div class="spell-circle"></div>
      <p>Consulting the ancient scrolls...</p>
    </div>
    
    <div v-else-if="error" class="curse-warning">
      <div class="skull-icon">💀</div>
      <p>A dark curse prevents us from viewing the roster:<br>{{ error }}</p>
    </div>

    <div v-else class="guild-departments">
      <div v-for="(group, department) in groupedEmployees" :key="department" class="department-section">
        <div class="department-banner">
          <h3>{{ department }}</h3>
          <div class="banner-decoration">✦ {{ group.length }} members ✦</div>
        </div>
        
        <div class="member-grid">
          <div v-for="emp in group" :key="emp.id" class="guild-member" @click="viewDetails(emp.id)">
            <div class="member-portrait-frame">
              <img v-if="emp.employePhoto" :src="emp.employePhoto" class="member-portrait">
              <div v-else class="placeholder-portrait">{{ emp.empName.charAt(0) }}</div>
            </div>
            
            <div class="member-info">
              <h4 class="member-name">{{ emp.empName }}</h4>
              <div class="member-stats">
                <p><span class="stat-icon">🛡️</span> {{ emp.experience || '0' }} years service</p>
                <p><span class="stat-icon">🏠</span> {{ emp.address || 'Unknown realm' }}</p>
                <p><span class="stat-icon">📅</span> {{ formatDate(emp.birthdate) }}</p>
              </div>
            </div>
            
            <div class="member-rank">
              <span class="rank-badge">Level {{ Math.min(50, Math.floor((emp.experience || 0)/2)) || 1 }}</span>
            </div>
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
    name: 'Team_member',
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
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&family=Cinzel+Decorative&display=swap');

.fantasy-guild-hall {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'MedievalSharp', cursive;
  color: #3a2c1a;
}

.guild-title {
  text-align: center;
  font-family: 'Cinzel Decorative', cursive;
  color: #5c3a21;
  text-shadow: 2px 2px 4px rgba(92, 58, 33, 0.3);
  margin-bottom: 2rem;
  font-size: 2.5rem;
  letter-spacing: 1px;
  position: relative;
}

.guild-title::before,
.guild-title::after {
  content: "❖";
  margin: 0 1rem;
  color: #8b5a2b;
}

/* Loading Animation */
.spellcasting {
  text-align: center;
  padding: 3rem;
  color: #5c3a21;
}

.spell-circle {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  border: 3px dashed #8b5a2b;
  border-radius: 50%;
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Error State */
.curse-warning {
  background: rgba(139, 0, 0, 0.1);
  border: 2px solid #8b0000;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  max-width: 600px;
  margin: 2rem auto;
  color: #8b0000;
}

.skull-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Department Sections */
.guild-departments {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.department-section {
  background: rgba(255, 248, 230, 0.7);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(139, 90, 43, 0.2);
}

.department-banner {
  background: linear-gradient(to right, #8b5a2b, #5b3c11);
  color: #f4f1e1;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.department-banner h3 {
  margin: 0;
  font-size: 1.5rem;
  font-family: 'Cinzel Decorative', cursive;
  letter-spacing: 1px;
}

.banner-decoration {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Member Grid */
.member-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.guild-member {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(139, 90, 43, 0.1);
}

.guild-member:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(139, 90, 43, 0.3);
}

.member-portrait-frame {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  background: #f4f1e1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 2px dashed #c2a36b;
}

.member-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-portrait {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #5b3c11;
  background: #e6d5b8;
}

.member-info {
  padding: 0.8rem;
  flex-grow: 1;
}

.member-name {
  margin: 0 0 0.5rem 0;
  color: #5b3c11;
  font-size: 1.2rem;
}

.member-stats {
  font-size: 0.9rem;
}

.member-stats p {
  margin: 0.3rem 0;
  display: flex;
  align-items: center;
}

.stat-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.member-rank {
  padding: 0.5rem;
  display: flex;
  align-items: flex-start;
}

.rank-badge {
  background: #8b5a2b;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .member-grid {
    grid-template-columns: 1fr;
  }
  
  .guild-title {
    font-size: 2rem;
  }
}
</style>
  

  