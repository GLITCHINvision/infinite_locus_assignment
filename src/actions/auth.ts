'use server'

import { z } from 'zod'
import bcryptjs from 'bcryptjs'
import prisma from '@/lib/prisma'
import { createSession, destroySession } from '@/lib/auth'
import { redirect } from 'next/navigation'

const registrationSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function register(formData: FormData) {
  const validatedFields = registrationSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { displayName, email, password } = validatedFields.data

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        error: { email: ['Email already in use'] },
      }
    }

    const passwordHash = await bcryptjs.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        displayName,
        email,
        passwordHash,
      },
    })

    await createSession(user.id, user.role)
  } catch (err) {
    return {
      error: { form: ['Something went wrong. Please try again.'] },
    }
  }

  redirect('/')
}

export async function login(formData: FormData) {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        error: { form: ['Invalid email or password'] },
      }
    }

    const passwordMatch = await bcryptjs.compare(password, user.passwordHash)

    if (!passwordMatch) {
      return {
        error: { form: ['Invalid email or password'] },
      }
    }

    await createSession(user.id, user.role)
  } catch (err) {
    return {
      error: { form: ['Something went wrong. Please try again.'] },
    }
  }

  redirect('/')
}

export async function logout() {
  await destroySession()
  redirect('/login')
}
