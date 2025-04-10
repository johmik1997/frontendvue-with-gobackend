<template>
    <div class="events-list fantasy-scroll">
      <h2 class="fantasy-title">Upcoming Guild Events</h2>
      <div v-if="loading" class="fantasy-loading">Consulting the celestial orbs...</div>
      <div v-else-if="error" class="fantasy-error">⚠️ The stars are misaligned: {{ error }}</div>
      
      <div v-else>
        <div v-for="event in events" :key="event.id" class="event-card enchanted-card">
          <h3 class="event-name">🔮 {{ event.name }}</h3>
          <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
          <p><strong>Location:</strong> {{ event.location || 'Mystical Realm' }}</p>
          <p><strong>Host:</strong> {{ event.host || 'Ancient One' }}</p>
          <p><strong>Description:</strong> {{ event.description }}</p>
          <div v-if="event.participants.length > 0">
            <strong>Attendees:</strong>
            <ul class="participant-list">
              <li v-for="participant in event.participants" :key="participant.id">
                🧙 {{ participant.name }} ({{ participant.class }})
              </li>
            </ul>
          </div>
          <button @click="registerForEvent(event.id)" class="enchanted-button">
            ✍️ Sign Scroll
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../api/api'
  
  export default {
    name:'UpcomingEvents',
    data() {
      return {
        events: [],
        loading: false,
        error: null
      }
    },
    async created() {
      await this.fetchEvents()
    },
    methods: {
      async fetchEvents() {
        try {
          this.loading = true
          this.error = null
          const data = await api.queryGraphQL(`
            query {
              upcomingEvents {
                id
                name
                date
                location
                host
                description
                participants {
                  id
                  name
                  class
                }
              }
            }
          `)
          this.events = data.upcomingEvents || []
        } catch (err) {
          this.error = err.message || 'Failed to divine events'
          console.error('Error:', err)
        } finally {
          this.loading = false
        }
      },
      async registerForEvent(eventId) {
        try {
          await api.queryGraphQL(`
            mutation RegisterForEvent($eventId: ID!) {
              registerForEvent(eventId: $eventId) {
                id
                name
              }
            }
          `, { eventId })
          this.$toast.success('Your name appears on the scroll!')
          await this.fetchEvents() // Refresh list
        } catch (err) {
          this.$toast.error(`Spell failed: ${err.message}`)
        }
      },
      formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    }
  }
  </script>
  
 
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');

.events-list {
  font-family: 'MedievalSharp', cursive;
  background: #f4f1e1;
  border: 2px solid #8b5a2b;
  border-radius: 15px;
  padding: 2rem;
  max-width: 900px;
  margin: 3rem auto;
  box-shadow: 0 0 20px rgba(139, 90, 43, 0.5);
}

.event-card {
  background: rgba(255, 248, 230, 0.8);
  border: 2px solid #b8860b;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
}

.event-card::before {
  content: '✧';
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  opacity: 0.3;
  color: #8b5a2b;
}

.event-name {
  color: #5b3c11;
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
  border-bottom: 2px dashed #c2a36b;
  padding-bottom: 0.5rem;
}

.participant-list {
  list-style-type: none;
  padding-left: 1rem;
}

.participant-list li {
  margin: 0.3rem 0;
  padding-left: 1.5rem;
  list-style-type: '→ ';
}

  .enchanted-button {
    background: linear-gradient(to bottom, #c2a36b, #8b5a2b);
    color: #fff8e6;
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-family: 'MedievalSharp', cursive;
    cursor: pointer;
    margin-top: 1rem;
    transition: all 0.3s ease;
  }
  
  .enchanted-button:hover {
    background: linear-gradient(to bottom, #d4b87c, #9c6b33);
    box-shadow: 0 0 10px rgba(210, 180, 140, 0.7);
    transform: translateY(-2px);
  }
  
  /* Shared fantasy styles from employee list */
  .fantasy-title {
    /* Reuse your existing title styles */
  }
  </style>