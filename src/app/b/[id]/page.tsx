import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { ReviewForm } from '@/components/business/ReviewForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, MapPin, User } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// Next.js 15: params is now a Promise
export default async function BusinessPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const business = await prisma.business.findUnique({
    where: { id },
    include: {
      reviews: {
        where: { status: 'APPROVED' },
        include: {
          user: { select: { displayName: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { reviews: { where: { status: 'APPROVED' } } },
      },
    },
  })

  if (!business) notFound()

  const session = await getSession()
  const photos = JSON.parse(business.photos || '[]')
  const avgRating =
    business.reviews.length > 0
      ? business.reviews.reduce((acc, r) => acc + r.rating, 0) / business.reviews.length
      : 0

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Business Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border">
              <img
                src={
                  photos[0] ||
                  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800&h=600'
                }
                alt={business.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {business.category}
                </span>
                <div className="flex items-center text-yellow-500 font-bold">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="ml-1 text-lg">{avgRating.toFixed(1)}</span>
                  <span className="text-gray-400 font-normal text-sm ml-2">
                    ({business._count.reviews} reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{business.name}</h1>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">{business.description}</p>

              <div className="flex items-center gap-2 text-slate-500 pt-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>
                  {business.address}, {business.city}, {business.state}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Review List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">
              Customer Reviews{' '}
              <span className="text-gray-400 text-base font-normal">({business.reviews.length})</span>
            </h2>

            {business.reviews.length > 0 ? (
              <div className="space-y-4">
                {business.reviews.map((review) => (
                  <Card key={review.id} className="border-gray-100 bg-white shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">{review.user.displayName}</p>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </CardHeader>
                    <CardContent className="pt-4 text-slate-600 leading-relaxed">{review.content}</CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                <User className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No approved reviews yet. Be the first!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {session ? (
              <ReviewForm businessId={business.id} />
            ) : (
              <Card className="bg-blue-600 text-white border-none shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle>Share your experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-blue-100">Log in to rate this business and help others find the best spots.</p>
                  <Link href="/login" className="block">
                    <Button
                      variant="outline"
                      className="w-full bg-white text-blue-600 hover:bg-blue-50 border-none"
                    >
                      Log In to Review
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <Card className="border-gray-100 bg-white">
              <CardHeader>
                <CardTitle className="text-base">About {business.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-500 leading-relaxed">
                Located in {business.city}, {business.state}. Listed since{' '}
                {new Date(business.createdAt).toLocaleDateString()}.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
