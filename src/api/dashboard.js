// src/api/dashboard.js
import axios from 'axios'

export const fetchDashboardData = async () => {
  try {
    const response = await axios.get('/api/dashboard', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    throw error
  }
}