// src/auth/authenticateUser.js
import { ROLE_MATRIX } from "./RoleMatrix";

export const authenticateUser = (email, password) => {
  const matchedUser = ROLE_MATRIX.find(
    (user) => user.email === email && user.password === password
  );

  if (!matchedUser) {
    return { success: false, message: "Invalid credentials" };
  }

  return {
    success: true,
    message: "Login successful",
    role: matchedUser.role,
    user: matchedUser,
  };
};
