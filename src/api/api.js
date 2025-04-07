import axios from 'axios'

const API_URL = 'http://localhost:8080/graphql'

export default {
  async queryGraphQL(query, variables = {}) {
    const response = await axios.post(API_URL, {
      query,
      variables
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message)
    }
    
    return response.data.data
  }
}