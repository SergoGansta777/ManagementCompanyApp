import axios from 'axios'

const BACKEND_API_URL = 'http://127.0.0.1:8080/api/'

const axiosInstance = axios.create({
  baseURL: BACKEND_API_URL
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
