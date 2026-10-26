// Validation utilities for GoldCare forms

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isValidMobile = (mobile) => {
  return /^[6-9]\d{9}$/.test(mobile.replace(/\D/g, ''));
};

export const isValidPincode = (pin) => {
  return /^\d{6}$/.test(pin.trim());
};

export const isNotEmpty = (val) => {
  return val !== null && val !== undefined && String(val).trim().length > 0;
};

export const isValidTime = (time) => {
  return /^\d{2}:\d{2}$/.test(time);
};

export const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
};

export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false;
  const parts = String(date).split('-');
  if (parts.length === 3) {
    const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return target >= today;
  }
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
};

export const validateBookingForm = (form) => {
  const errors = {};

  if (!isNotEmpty(form.customerName)) errors.customerName = 'Full name is required';
  if (!isNotEmpty(form.mobile) || !isValidMobile(form.mobile))
    errors.mobile = 'Enter a valid 10-digit mobile number';
  if (form.email && !isValidEmail(form.email))
    errors.email = 'Enter a valid email address';
  if (!isNotEmpty(form.jewelleryType)) errors.jewelleryType = 'Select jewellery type';
  if (!isNotEmpty(form.repairService)) errors.repairService = 'Select a repair service';
  if (!isNotEmpty(form.shopId)) errors.shopId = 'Select a jewellery shop';
  if (!isNotEmpty(form.description)) errors.description = 'Please describe your jewellery';
  if (!isNotEmpty(form.appointmentDate)) errors.appointmentDate = 'Select appointment date';
  else if (!isFutureDate(form.appointmentDate))
    errors.appointmentDate = 'Appointment date must be today or in the future';
  if (!isNotEmpty(form.appointmentTime)) errors.appointmentTime = 'Select appointment time';

  return errors;
};

export const validateShopForm = (form) => {
  const errors = {};

  if (!isNotEmpty(form.name)) errors.name = 'Shop name is required';
  if (!isNotEmpty(form.owner)) errors.owner = 'Owner name is required';
  if (!isNotEmpty(form.contact) || !isValidMobile(form.contact))
    errors.contact = 'Enter a valid 10-digit contact number';
  if (form.email && !isValidEmail(form.email))
    errors.email = 'Enter a valid email address';
  if (!isNotEmpty(form.address)) errors.address = 'Address is required';
  if (!isNotEmpty(form.city)) errors.city = 'City is required';
  if (!isNotEmpty(form.state)) errors.state = 'State is required';
  if (!isNotEmpty(form.pincode) || !isValidPincode(form.pincode))
    errors.pincode = 'Enter a valid 6-digit PIN code';
  if (!form.services || form.services.length === 0)
    errors.services = 'Select at least one service';
  if (!isNotEmpty(form.openTime)) errors.openTime = 'Opening time is required';
  if (!isNotEmpty(form.closeTime)) errors.closeTime = 'Closing time is required';

  return errors;
};

export const validateLoginForm = (form) => {
  const errors = {};
  if (!isNotEmpty(form.username)) errors.username = 'Username is required';
  if (!isNotEmpty(form.password)) errors.password = 'Password is required';
  return errors;
};
