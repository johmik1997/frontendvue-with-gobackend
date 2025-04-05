import axios from 'axios'

const API_URL = 'http://localhost:8080'

export default {
  async queryGraphQL(query) {
    const response = await axios.get(`${API_URL}/graphql`, {
      params: { query },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data.data
  }
}