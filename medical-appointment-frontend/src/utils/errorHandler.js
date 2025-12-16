/**
 * Safely extract error message from various error formats
 * @param {Error|Object} error - The error object
 * @param {string} defaultMessage - Fallback message if extraction fails
 * @returns {string} - The extracted error message
 */
export const getErrorMessage = (error, defaultMessage = 'Une erreur est survenue') => {
  // If error is already a string, return it
  if (typeof error === 'string') {
    return error;
  }

  // Try to extract from error.response.data.message
  if (error?.response?.data?.message) {
    const msg = error.response.data.message;
    // If message is an object, try to extract its message property
    if (typeof msg === 'object' && msg.message) {
      return typeof msg.message === 'string' ? msg.message : defaultMessage;
    }
    // If message is a string, return it
    if (typeof msg === 'string') {
      return msg;
    }
  }

  // Try to extract from error.response.data directly (if it's a string)
  if (typeof error?.response?.data === 'string') {
    return error.response.data;
  }

  // Try to extract from error.message
  if (error?.message && typeof error.message === 'string') {
    return error.message;
  }

  // Return default message
  return defaultMessage;
};
