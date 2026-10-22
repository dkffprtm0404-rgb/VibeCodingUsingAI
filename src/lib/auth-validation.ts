import { MIN_PASSWORD_LENGTH } from '@/constants'
import { isRecord } from '@/lib/utils'

export function readCredentials(input: unknown): { email: string; password: string } | null {
  if (!isRecord(input) || typeof input.email !== 'string' || typeof input.password !== 'string') return null
  const email = input.email.trim()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || !input.password || input.password.length > 1024) return null
  return { email, password: input.password }
}

export function readSignup(input: unknown): { email: string; password: string; name: string } | null {
  const credentials = readCredentials(input)
  if (!credentials || credentials.password.length < MIN_PASSWORD_LENGTH || !isRecord(input)
    || typeof input.name !== 'string' || !input.name.trim() || input.name.trim().length > 100) return null
  return { ...credentials, name: input.name.trim() }
}
