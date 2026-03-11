import { cookies } from 'next/headers'
import { encrypt, decrypt } from './session'

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  return decrypt(session)
}

export async function createSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, role, expires })
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { expires: new Date(0), path: '/' })
}

export { decrypt } from './session'
