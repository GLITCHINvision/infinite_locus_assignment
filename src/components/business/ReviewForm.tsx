'use client'

import { useState } from 'react'
import { submitReview } from '@/actions/reviews'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Star } from 'lucide-react'

export function ReviewForm({ businessId }: { businessId: string }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<any>({})

  async function handleSubmit(formData: FormData) {
    if (rating === 0) {
      setErrors({ rating: ['Please select a rating'] })
      return
    }

    setIsSubmitting(true)
    setErrors({})
    
    formData.append('rating', rating.toString())
    formData.append('businessId', businessId)
    
    const result = await submitReview(formData)
    
    setIsSubmitting(false)
    
    if (result?.error) {
      setErrors(result.error)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-100 p-8 rounded-xl text-center">
        <h3 className="text-xl font-bold text-green-800 mb-2">Thank you!</h3>
        <p className="text-green-700">
          Your review has been submitted for moderation. It will appear once approved by our admins.
        </p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => {
            setSuccess(false)
            setRating(0)
          }}
        >
          Submit another review
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Your Rating</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform active:scale-95"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star 
                  className={`w-8 h-8 ${
                    star <= (hover || rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-xs text-red-500">{errors.rating[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Review Details</Label>
          <Textarea 
            id="content"
            name="content"
            placeholder="Share your experience with others..."
            className="min-h-[120px]"
            required
          />
          {errors.content && <p className="text-xs text-red-500">{errors.content[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="photos">Photo URLs (Optional)</Label>
          <Input 
            id="photos"
            name="photos"
            placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
          />
          <p className="text-xs text-gray-400">Separate multiple URLs with commas</p>
        </div>

        {errors.form && (
          <p className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 italic">
            {errors.form[0]}
          </p>
        )}

        <Button className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Post Review'}
        </Button>
      </form>
    </div>
  )
}
