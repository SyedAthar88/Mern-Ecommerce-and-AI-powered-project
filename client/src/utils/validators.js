// ==========================================
// Email format check
// ==========================================
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ==========================================
// LOGIN validation
// ==========================================
export const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

// ==========================================
// SIGNUP validation (used in sub-step 4)
// ==========================================
export const validateSignup = ({ name, email, password }) => {
  const errors = {};

  if (!name) {
    errors.name = "Name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (name.trim().length > 50) {
    errors.name = "Name must be under 50 characters";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (password.length > 100) {
    errors.password = "Password is too long";
  }

  return errors;
};

// ==========================================
// FORGOT PASSWORD validation (used in sub-step 5)
// ==========================================
export const validateForgotPassword = ({ email }) => {
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email";
  }

  return errors;
};

// ==========================================
// RESET PASSWORD validation (used in sub-step 6)
// ==========================================
export const validateResetPassword = ({ password, confirmPassword }) => {
  const errors = {};

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (password.length > 100) {
    errors.password = "Password is too long";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};