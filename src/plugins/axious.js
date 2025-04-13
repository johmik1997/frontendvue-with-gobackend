// src/plugins/axios.js
import axios from 'axios'
export default {
    install: (app) => {
        console.log('Axios plugin installed',app)
      // Set up request interceptor to add token
      axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      }, (error) => {
        return Promise.reject(error)
      })
  
      // Set up response interceptor to handle 401 errors
      axios.interceptors.response.use((response) => {
        return response
      }, (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('isAdmin')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      })
    }
  }