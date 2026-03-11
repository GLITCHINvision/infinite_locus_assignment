'use client'

import { useState } from 'react'
import { register } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default function RegisterPage() {
  const [errors, setErrors] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setErrors({})
    const result = await register(formData)
    if (result?.error) {
      setErrors(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <Card className="w-full max-w-md bg-white/50 backdrop-blur-sm border-gray-100 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight text-center">Create account</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Join the community and start reviewing local businesses
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input 
                id="displayName" 
                name="displayName" 
                placeholder="John Doe" 
                required 
                className={errors.displayName ? 'border-red-500' : ''}
              />
              {errors.displayName && <p className="text-xs text-red-500">{errors.displayName[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password[0]}</p>}
            </div>
            {errors.form && (
              <p className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 italic">
                {errors.form[0]}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full h-11 text-base font-semibold" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
