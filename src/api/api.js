
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://backendwithgo.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log(token)
  }
  return config
}, error => {
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response) {
    // Improved error logging
    console.error('API Error Details:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    })
    
    if (error.response.status === 401) {
      localStorage.removeItem('token')
      // You might want to redirect to login here
    }
  }
  return Promise.reject(error)
})

export default {
  async queryGraphQL(query, variables = {}) {
    try {
      // Stringify the entire body to ensure proper formatting
      const requestBody = JSON.stringify({
        query: query.trim(), // Trim whitespace from query
        variables
      })

      const response = await instance.post('/graphql', requestBody)

      if (response.data.errors) {
        const errorMessages = response.data.errors.map(err => err.message).join('\n')
        throw new Error(`GraphQL Error: ${errorMessages}`)
      }
      console.log('Raw API response:', response.data);
      return response.data.data
    } catch (error) {
      console.error('Full API Error:', {
        message: error.message,
        request: error.config?.data,
        response: error.response?.data
      })
      throw error
    }
  }
}