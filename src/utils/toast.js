import toast from 'react-hot-toast'

const baseOptions = {
  duration: 3000,
  style: {
    borderRadius: '12px',
    background: '#2a1f18',
    color: '#f6efe7',
    border: '1px solid rgba(220, 200, 182, 0.22)',
    boxShadow: '0 10px 24px rgba(30,20,10,0.30)',
    fontSize: '14px',
  },
}

// Use for successful actions like login, create, update.
export const successToast = (message = 'Action completed successfully.') => {
  toast.success(message, baseOptions)
}

// Use for API/network/server failures.
export const errorToast = (message = 'Something went wrong. Please try again.') => {
  toast.error(message, {
    ...baseOptions,
    duration: 4000,
  })
}

// Use for caution or attention messages.
export const warningToast = (message = 'Please review this action.') => {
  toast(message, {
    ...baseOptions,
    icon: '!',
  })
}

// Use for neutral informational messages.
export const infoToast = (message = 'Here is an update for you.') => {
  toast(message, {
    ...baseOptions,
    icon: 'i',
  })
}
