import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Star } from 'lucide-react'

interface BusinessCardProps {
  business: {
    id: string
    name: string
    category: string
    address: string
    city: string
    photos: string
    _count?: {
      reviews: number
    }
  }
}

export function BusinessCard({ business }: BusinessCardProps) {
  const photos = JSON.parse(business.photos || '[]')
  const mainPhoto = photos[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800&h=600'

  return (
    <Link href={`/b/${business.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow border-gray-100 group">
        <div className="aspect-[4/3] overflow-hidden relative">
          <img 
            src={mainPhoto} 
            alt={business.name} 
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 text-black hover:bg-white">{business.category}</Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-1 leading-tight">{business.name}</h3>
          <p className="text-sm text-gray-500 mb-2 truncate">
            {business.address}, {business.city}
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-xs text-gray-400 ml-1">
              ({business._count?.reviews || 0} reviews)
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  )
}
