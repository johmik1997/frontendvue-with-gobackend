<template>
    <div class="team-list fantasy-scroll">
      <h2 class="fantasy-title">Guild Fellowship</h2>
      <div v-if="loading" class="fantasy-loading">Consulting the tome of members...</div>
      <div v-else-if="error" class="fantasy-error">⚠️ A curse obscures our vision: {{ error }}</div>
      
      <div v-else>
        <div v-for="member in teamMembers" :key="member.id" class="member-card enchanted-card">
          <div class="member-header">
            <h3 class="member-name">🏰 {{ member.empName }}</h3>
            <span class="member-class">{{ member.department || 'Mysterious Order' }}</span>
          </div>
          <div class="member-details">
            <p><strong>Years of Service:</strong> {{ member.experience || 'Unknown' }} seasons</p>
            <p><strong>Realm:</strong> {{ member.address || 'Hidden domain' }}</p>
            <p><strong>Joined:</strong> {{ formatDate(member.createdAt) || 'Time unknown' }}</p>
          </div>
          <div v-if="member.employePhoto" class="member-portrait">
            <img :src="member.employePhoto" alt="Member portrait" class="enchanted-photo">
          </div>
          <button @click="sendMessage(member.id)" class="enchanted-button">
            ✉️ Send Raven
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../api/api'
  
  export default {
    name: 'TeamMember',
    data() {
      return {
        teamMembers: [],
        loading: false,
        error: null
      }
    },
    async created() {
      await this.fetchTeamMembers()
    },
    methods: {
        async fetchTeamMembers() {
  try {
    this.loading = true
    this.error = null
    
    // Check for token first
    if (!localStorage.getItem('token')) {
      throw new Error('Please login to view team members')
    }

    const data = await api.queryGraphQL(`
      query {
        teamMembers {
          id
          empId
          empName
          department
          experience
          address
          employePhoto
          createdAt
        }
      }
    `)
    
    this.teamMembers = data.teamMembers || []
  } catch (err) {
    this.error = err.message || 'Failed to load team members'
    if (err.message.includes('authorization') || err.message.includes('login')) {
      this.$router.push('/login')
    }
  } finally {
    this.loading = false
  }
},
      sendMessage(memberId) {
        this.$router.push(`/messages/compose?to=${memberId}`)
      },
      formatDate(dateString) {
        if (!dateString) return null
        const date = new Date(dateString)
        return date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    }
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
  
  .team-list {
    font-family: 'MedievalSharp', cursive;
  background: #f4f1e1;
  border: 2px solid #8b5a2b;
  border-radius: 15px;
  padding: 2rem;
  max-width: 900px;
  margin: 3rem auto;
  box-shadow: 0 0 20px rgba(139, 90, 43, 0.5);
  }
  
  .member-card {
    background: rgba(255, 248, 230, 0.8);
    border: 2px solid #b8860b;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    position: relative;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
  }
  
  .member-header {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px dashed #c2a36b;
    padding-bottom: 0.5rem;
  }
  
  .member-name {
    color: #5b3c11;
    font-size: 1.5rem;
    margin: 0;
  }
  
  .member-class {
    background: #8b5a2b;
    color: #f4f1e1;
    padding: 0.2rem 0.8rem;
    border-radius: 15px;
    font-size: 0.9rem;
  }
  
  .member-details {
    grid-column: 1;
  }
  
  .member-portrait {
    grid-column: 2;
    grid-row: 2 / 4;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .enchanted-photo {
    max-width: 120px;
    max-height: 120px;
    border: 3px solid #cfa45e;
    border-radius: 10px;
    box-shadow: 0 0 8px rgba(210, 180, 140, 0.6);
  }
  
  .enchanted-button {
    grid-column: 1;
    background: linear-gradient(to bottom, #8b5a2b, #5b3c11);
    color: #f4f1e1;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-family: 'MedievalSharp', cursive;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }
  
  .enchanted-button:hover {
    background: linear-gradient(to bottom, #9c6b33, #6c4d22);
    box-shadow: 0 0 10px rgba(210, 180, 140, 0.7);
  }
  
  /* Shared fantasy styles */
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
  </style>