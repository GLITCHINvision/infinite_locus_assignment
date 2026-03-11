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
      description: 'Fast and reliable computer and smartphone repair services.',
      category: 'Service',
      address: '789 Tech Blvd',
      city: 'San Francisco',
      state: 'CA',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1588702525624-a7408d6d6ce6?auto=format&fit=crop&q=80&w=800&h=600']),
    },
    {
      name: 'Green Thumb Nursery',
      description: 'Wide variety of indoor and outdoor plants, gardening supplies, and expert advice.',
      category: 'Retail',
      address: '101 Plant Dr',
      city: 'Austin',
      state: 'TX',
      photos: JSON.stringify(['https://images.unsplash.com/photo-1580227806530-5b1fec3e9508?auto=format&fit=crop&q=80&w=800&h=600']),
    },
  ]

  for (const b of businesses) {
    const business = await prisma.business.create({ data: b })
    console.log(`Business created: ${business.name}`)
    await prisma.review.create({
      data: {
        rating: 5,
        content: 'Absolutely fantastic! Highly recommend checking this place out.',
        status: 'APPROVED',
        userId: user.id,
        businessId: business.id,
      },
    })
    await prisma.review.create({
      data: {
        rating: 4,
        content: 'Really good experience overall, but could be a bit better.',
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
