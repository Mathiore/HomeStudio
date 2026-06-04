export function generateId(): string {
  return crypto.randomUUID()
}

export function generateCode(prefix: string, sequence: number): string {
  return `${prefix}-${String(sequence).padStart(4, '0')}`
}
