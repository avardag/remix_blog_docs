export function validateFieldLength(
  field: string,
  fieldName: string,
  minLength: number
) {
  if (typeof field !== "string" || field.trim().length < 3) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
}
