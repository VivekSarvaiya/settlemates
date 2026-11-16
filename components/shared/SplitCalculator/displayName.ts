export function displayName(name: string, index: number): string {
  return name.trim() || `Person ${index + 1}`;
}
