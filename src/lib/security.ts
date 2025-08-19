// Security utilities for additional protection

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (Brazilian format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?55?\s?\(?[0-9]{2}\)?\s?[0-9]{4,5}-?[0-9]{4}$/;
  return phoneRegex.test(phone);
}

// Date validation
export function isValidDate(date: string): boolean {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

// Budget validation (positive number)
export function isValidBudget(budget: number): boolean {
  return typeof budget === 'number' && budget >= 0 && budget <= 1000000; // Max 1M
}

// CSRF protection token (simple implementation)
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Rate limiting for specific actions
const actionRateLimit = new Map<string, { count: number; resetTime: number }>();

export function checkActionRateLimit(userId: string, action: string, limit: number = 10, windowMs: number = 60000): boolean {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const userLimit = actionRateLimit.get(key);
  
  if (!userLimit || now > userLimit.resetTime) {
    actionRateLimit.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= limit) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

// Logging for security events
export function logSecurityEvent(event: string, userId?: string, details?: unknown) {
  console.warn(`[SECURITY] ${event}`, { userId, details, timestamp: new Date().toISOString() });
  // In production, send to your logging service
}
