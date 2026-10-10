// Generate random password
export function generateRandomPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// Simple password hash (in production, use bcryptjs in server-side code)
// For client-side, we'll send password to backend for hashing
export async function hashPassword(password: string): Promise<string> {
  // This is a client-side placeholder
  // Actual hashing should happen on the server
  return btoa(password) // Base64 encoding (NOT secure, use proper hashing on backend)
}

// Verify password (client-side placeholder)
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // This is a client-side placeholder
  // Actual verification should happen on the server
  return btoa(password) === hash
}
