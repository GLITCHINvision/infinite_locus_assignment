import Link from 'next/link'
import prisma from '@/lib/prisma'
import { BusinessCard } from '@/components/business/BusinessCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

// Next.js 15: searchParams is now a Promise
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const params = await searchParams
  const query = params.q || ''
  const category = params.category || ''

  const businesses = await prisma.business.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { name: { contains: query } },
                { description: { contains: query } },
                { city: { contains: query } },
              ],
            }
          : {},
        category ? { category } : {},
      ],
    },
    include: {
      _count: { select: { reviews: true } },
    },
  })

  const categories = ['Cafe', 'Restaurant', 'Service', 'Retail', 'Education', 'Health']

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Find the best local <span className="text-blue-600">businesses</span> in town
          </h1>
          <p className="text-xl text-slate-500 mb-10">
            Browse thousands of trusted reviews from people in your community.
          </p>

          <form className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                name="q"
                placeholder="Search by name, city or keyword..."
                className="pl-10 h-14 text-lg border-gray-200 shadow-sm"
                defaultValue={query}
              />
            </div>
            <Button className="h-14 px-8 text-lg font-bold shadow-lg">Search</Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-56 space-y-6 shrink-0">
          <h3 className="font-bold text-lg">Categories</h3>
          <div className="flex flex-wrap md:flex-col gap-2">
            <CategoryLink params={params} category="" label="All Categories" />
            {categories.map((cat) => (
              <CategoryLink key={cat} params={params} category={cat} label={cat} />
            ))}
          </div>
        </aside>

        {/* Business Grid */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-8">
            {category ? `${category}s` : 'All Businesses'}
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({businesses.length} found)
            </span>
          </h2>

          {businesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-lg">No businesses found matching your search.</p>
              <Link href="/" className="text-blue-600 text-sm underline mt-2 block">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CategoryLink({
  params,
  category,
  label,
}: {
  params: { q?: string; category?: string }
  category: string
  label: string
}) {
  const isActive = (params.category || '') === category
  const qs = new URLSearchParams()
  if (params.q) qs.set('q', params.q)
  if (category) qs.set('category', category)
  const href = `/?${qs.toString()}`

  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-blue-600 text-white font-semibold'
          : 'bg-white border text-gray-600 hover:border-blue-300'
      }`}
    >
      {label}
    </Link>
  )
}
