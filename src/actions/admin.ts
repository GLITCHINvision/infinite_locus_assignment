'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function moderateReview(reviewId: string, status: 'APPROVED' | 'REJECTED') {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  try {
    await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    })

    revalidatePath('/admin')
    revalidatePath(`/b`) // Could be more specific if we had the businessId
    return { success: true }
  } catch (err) {
    return { error: 'Failed to update review status' }
  }
}
