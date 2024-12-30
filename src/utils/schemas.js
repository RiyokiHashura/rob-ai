import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })

export const SCHEMAS = {
  API_RESPONSE: {
    type: 'object',
    required: ['message', 'metrics'],
    properties: {
      message: { type: 'string' },
      metrics: {
        type: 'object',
        required: ['trustChange', 'suspicionChange', 'intent', 'tone'],
        properties: {
          trustChange: { type: 'number' },
          suspicionChange: { type: 'number' },
          intent: { type: 'string' },
          tone: { type: 'string' },
          reason: { type: 'string' }
        }
      }
    }
  },

  INTENT_FLAGS: {
    type: 'object',
    required: ['detected', 'confidence'],
    properties: {
      detected: { type: 'boolean' },
      confidence: { 
        type: 'number',
        minimum: 0,
        maximum: 1
      }
    }
  }
}

export const validateSchema = (data, schema) => {
  const validate = ajv.compile(schema)
  if (!validate(data)) {
    const errors = ajv.errorsText(validate.errors)
    throw new Error(`Validation failed: ${errors}`)
  }
  return true
} 