import axios from 'axios'

// const API_URL = 'http://localhost:8080'

export default {
  async login(username, password) {
    const response = await axios.post('http://localhost:8082/graphql', {
      query: `
        mutation LoginUser($username: String!, $password: String!) {
          login(username: $username, password: $password)
        }
      `,
      variables: { username, password }
    })
    
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message)
    }
    
    return response.data.data.login
  },
  logout() {
    localStorage.removeItem('token')
  }
}


