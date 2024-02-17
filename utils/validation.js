exports.validateBookingData = (data) => {
    // Check if data is provided
    if (!data) {
      return { valid: false, error: 'Data is required' };
    }
  
    // Check if startDate is provided and is a valid date
    if (!data.startDate || isNaN(Date.parse(data.startDate))) {
      return { valid: false, error: 'Invalid start date' };
    }
  
    // Check if endDate is provided and is a valid date
    if (!data.endDate || isNaN(Date.parse(data.endDate))) {
      return { valid: false, error: 'Invalid end date' };
    }
  
    // Check if roomType is provided
    if (!data.roomType) {
      return { valid: false, error: 'Room type is required' };
    }
    
    // If all validations pass, return valid true
    return { valid: true };
  };
  