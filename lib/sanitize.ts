export function sanitizeInput(input: string): string {
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove script tags specifically
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Encode dangerous characters
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    // Remove null bytes
    .replace(/\0/g, "")
    // Trim whitespace
    .trim();
}

export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9@._+-]/g, "");
}

export function detectPromptInjection(input: string): boolean {
  const injectionPatterns = [
    /ignore previous instructions/i,
    /ignore all instructions/i,
    /you are now/i,
    /forget your instructions/i,
    /new instructions:/i,
    /system:/i,
    /\[system\]/i,
    /act as/i,
    /pretend you are/i,
    /jailbreak/i,
  ];

  return injectionPatterns.some((pattern) => pattern.test(input));
}