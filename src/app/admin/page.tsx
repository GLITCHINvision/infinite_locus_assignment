import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { moderateReview } from '@/actions/admin'
import { CheckCircle2, XCircle, Clock, Star, MessageSquare, Users } from 'lucide-react'

export default async function AdminDashboard() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const pendingReviews = await prisma.review.findMany({
    where: { status: 'PENDING' },
    include: {
      user: { select: { displayName: true } },
      business: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const [totalReviews, totalUsers, totalBusinesses] = await Promise.all([
    prisma.review.count({ where: { status: 'APPROVED' } }),
    prisma.user.count(),
    prisma.business.count(),
  ])

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">System overview and review moderation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard title="Pending" value={pendingReviews.length} icon={<Clock className="w-5 h-5" />} color="bg-orange-50 text-orange-500" />
        <StatCard title="Approved Reviews" value={totalReviews} icon={<MessageSquare className="w-5 h-5" />} color="bg-green-50 text-green-500" />
        <StatCard title="Businesses" value={totalBusinesses} icon={<Star className="w-5 h-5" />} color="bg-blue-50 text-blue-500" />
        <StatCard title="Users" value={totalUsers} icon={<Users className="w-5 h-5" />} color="bg-purple-50 text-purple-500" />
      </div>

      {/* Review Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Review Queue</h2>
          <span className="text-sm text-gray-400">Awaiting moderation</span>
        </div>

        {pendingReviews.length > 0 ? (
          pendingReviews.map((review) => (
            <Card key={review.id} className="border-gray-100 overflow-hidden bg-white shadow-sm">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-blue-600 uppercase">{review.business.name}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-3">&ldquo;{review.content}&rdquo;</p>
                  <div className="text-xs text-gray-400 flex gap-2">
                    <span className="font-semibold text-gray-600">{review.user.displayName}</span>
                    <span>•</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 md:w-44 flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100">
                  {/* Approve form */}
                  <form
                    action={async () => {
                      'use server'
                      await moderateReview(review.id, 'APPROVED')
                    }}
                  >
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full text-green-600 hover:bg-green-50 border-green-100 bg-white gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </Button>
                  </form>

                  {/* Reject form */}
                  <form
                    action={async () => {
                      'use server'
                      await moderateReview(review.id, 'REJECTED')
                    }}
                  >
                    <Button
                      type="submit"
                      variant="ghost"
                      className="w-full text-red-500 hover:bg-red-50 gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-16 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">All caught up!</h3>
            <p className="text-gray-300">No reviews pending moderation.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-extrabold">{value}</p>
          </div>
          <div className={`${color} p-3 rounded-2xl`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
