import axios from 'axios'
const API_URL = 'http://localhost:8080/graphql'
export default {
  async queryGraphQL(query, variables = {}) {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    try {
      const response = await axios.post(API_URL, {
        query,
        variables
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      })

      if (response.data.errors) {
        const errorMessages = response.data.errors.map(err => err.message).join('\n')
        throw new Error(`GraphQL Error:\n${errorMessages}`)
      }

      return response.data.data
    } catch (error) {
      if (error.response) {
        // Handle 401 Unauthorized
        if (error.response.status === 401) {
          localStorage.removeItem('token')
          throw new Error('Session expired. Please login again.')
        }
        throw new Error(error.response.data.message || `Request failed (${error.response.status})`)
      }
      throw error
    }
  }
}