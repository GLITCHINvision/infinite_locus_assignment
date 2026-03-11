import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || 'hackathon-secret-key-2026'
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, { algorithms: ['HS256'] })
    return payload
  } catch {
    return null
  }
}
