import axios from 'axios'

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => response, error => {
  if (error.response.status === 401) {
    localStorage.removeItem('token')
    window.location = '/'
  }
  return Promise.reject(error)
})