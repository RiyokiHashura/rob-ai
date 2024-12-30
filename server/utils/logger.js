export const logger = {
  logAPI: {
    request: (type, data) => console.log(`API Request [${type}]:`, data),
    response: (status, data) => console.log(`API Response [${status}]:`, data),
    error: (data) => console.error('API Error:', data)
  }
} 