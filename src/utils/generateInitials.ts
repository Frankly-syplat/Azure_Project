/**
 * Generates initials from a user's first and last name
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Two-character initials in uppercase
 */
export function generateInitials(firstName: string, lastName: string): string {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}
