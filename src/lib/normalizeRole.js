// src/lib/normalizeRole.js
export function normalizeRole(roleStr = '') {
  // "ROLE_ADMIN" → "ADMIN"
  return roleStr.startsWith('ROLE_') ? roleStr.slice(5) : roleStr;
}
