import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcryptjs from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const dbUrl = process.env.DATABASE_URL!
const rawUrl = dbUrl.startsWith('file:') ? `file:${dbUrl.slice(5)}` : dbUrl
const adapter = new PrismaLibSql({ url: rawUrl })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  const adminPasswordHash = await bcryptjs.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      displayName: 'Admin User',
      role: 'ADMIN',
    },
  })
  console.log(`Admin created: ${admin.email}`)

  const userPasswordHash = await bcryptjs.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      displayName: 'Regular User',
      role: 'USER',
    },
  })
  console.log(`User created: ${user.email}`)

  await prisma.review.deleteMany({})
  await prisma.business.deleteMany({})

  const businesses = [
    {
      name: 'The Great Coffee Shop',
      description: 'Best artisanal coffee in the neighborhood with a cozy atmosphere perfect for working.',
      category: 'Cafe',
      address: '123 Main St',
      city: 'Portland',
      state: 'OR',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: "Luigi's Pizza",
      description: 'Authentic wood-fired Neapolitan pizza made with imported Italian ingredients.',
      category: 'Restaurant',
      address: '456 Oak Ave',
      city: 'New York',
      state: 'NY',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'TechFix Solutions',
      description: 'Fast and reliable computer and smartphone repair services with expert technicians.',
      category: 'Service',
      address: '789 Tech Blvd',
      city: 'San Francisco',
      state: 'CA',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'Green Thumb Nursery',
      description: 'Wide variety of indoor and outdoor plants, gardening supplies, and expert advice.',
      category: 'Retail',
      address: '101 Plant Dr',
      city: 'Austin',
      state: 'TX',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'Skyline Fitness Center',
      description: 'Modern gym with state-of-the-art equipment and specialized personal training.',
      category: 'Service',
      address: '222 Fit St',
      city: 'Chicago',
      state: 'IL',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'The Bookworm Nook',
      description: 'Independent bookstore featuring rare finds, cozy reading corners, and local author events.',
      category: 'Retail',
      address: '333 Leafy Ln',
      city: 'Seattle',
      state: 'WA',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'Artisan Bakery & Deli',
      description: 'Handcrafted sourdough breads, pastries, and gourmet sandwiches made fresh daily.',
      category: 'Cafe',
      address: '444 Yeast Way',
      city: 'Boulder',
      state: 'CO',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'Oceanic Seafood Grill',
      description: 'Fresh, sustainably sourced seafood served in a sophisticated waterfront setting.',
      category: 'Restaurant',
      address: '555 Pier 39',
      city: 'San Francisco',
      state: 'CA',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'Bright Minds Preschool',
      description: 'Nurturing and creative educational environment for early childhood development.',
      category: 'Education',
      address: '666 Learning Loop',
      city: 'Denver',
      state: 'CO',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'Wellness Oasis Spa',
      description: 'Holistic health treatments, therapeutic massages, and luxury skincare services.',
      category: 'Health',
      address: '777 Zen Cir',
      city: 'Miami',
      state: 'FL',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'The Vintage Vault',
      description: 'Curated selection of vintage clothing, accessories, and unique home decor items.',
      category: 'Retail',
      address: '888 Retro Rd',
      city: 'Nashville',
      state: 'TN',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'Metropolitan Dental Care',
      description: 'Advanced family and cosmetic dentistry in a comfortable, modern environment.',
      category: 'Health',
      address: '999 Smile Way',
      city: 'Phoenix',
      state: 'AZ',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'Starlight University',
      description: 'Premier research institution offering world-class programs and vibrant campus life.',
      category: 'Education',
      address: '1000 Scholar Blvd',
      city: 'Boston',
      state: 'MA',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1523050337452-57c6630a9072?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'Main Street Hardware',
      description: 'Your neighborhood source for tools, home improvement supplies, and friendly advice.',
      category: 'Retail',
      address: '1111 Anchor Dr',
      city: 'Atlanta',
      state: 'GA',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'Fusion Yoga Studio',
      description: 'Diverse yoga styles for all levels, from beginners to advanced practitioners.',
      category: 'Health',
      address: '1212 Flow Ln',
      city: 'San Diego',
      state: 'CA',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1506126613408-eca67ad4844a?auto=format&fit=crop&q=80&w=800&h=600']),
    },
  ]

  for (const b of businesses) {
    const business = await prisma.business.create({ data: b })
    console.log(`Business created: ${business.name}`)
    await prisma.review.create({
      data: {
        rating: 5,
        content: 'Absolutely fantastic! Every visit has been wonderful. The atmosphere is great and the staff are very helpful.',
        status: 'APPROVED',
        userId: user.id,
        businessId: business.id,
      },
    })
    await prisma.review.create({
      data: {
        rating: 4,
        content: 'Really good experience overall. I enjoyed it and would definitely come back again.',
        status: 'PENDING',
        userId: user.id,
        businessId: business.id,
      },
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
