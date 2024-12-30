export const logAPI = {
  request: (type, data) => console.log(`API Request [${type}]:`, data),
  response: (status, data) => console.log(`API Response [${status}]:`, data),
  error: (data) => console.error('API Error:', data)
}

export const logAnalysis = {
  start: (type) => console.log(`Analysis Started: ${type}`),
  context: (data) => console.log('Analysis Context:', data),
  intent: (response, flags) => console.log('Intent Analysis:', { response, flags }),
  end: () => console.log('Analysis Complete')
} 