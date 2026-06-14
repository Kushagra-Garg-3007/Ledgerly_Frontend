export const authValidationRules = {
  fullName: {
    required: 'Full name is required',
    minLength: {
      value: 3,
      message: 'Full name must be at least 3 characters'
    }
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    }
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters'
    },
    pattern: {
      value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
      message: 'Use uppercase, lowercase, and a number'
    }
  }
}
