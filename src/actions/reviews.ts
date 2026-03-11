'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  content: z.string().min(5, 'Review must be at least 5 characters'),
  photos: z.string().optional(), // Expecting a URL or comma separated URLs
  businessId: z.string(),
})

export async function submitReview(formData: FormData) {
  const session = await getSession()
  if (!session) {
    return { error: { form: ['You must be logged in to submit a review'] } }
  }

  const validatedFields = reviewSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { rating, content, photos, businessId } = validatedFields.data

  try {
    // Check if user already reviewed this business
    // (Optional: can allow multiple reviews or restrict to one)
    
    await prisma.review.create({
      data: {
        rating,
        content,
        photos: JSON.stringify(photos ? photos.split(',').map(p => p.trim()) : []),
        businessId,
        userId: session.userId,
        status: 'PENDING', // Reviews need admin approval
      },
    })

    revalidatePath(`/b/${businessId}`)
    return { success: true }
  } catch (err) {
    return {
      error: { form: ['Failed to submit review. Professional error.'] },
    }
  }
}
