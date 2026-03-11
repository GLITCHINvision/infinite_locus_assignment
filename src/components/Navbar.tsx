import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'

export default async function Navbar() {
  const session = await getSession()

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Review<span className="text-blue-600">Hub</span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:inline">
                Welcome back!
              </span>
              {session.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">Admin</Button>
                </Link>
              )}
              <form action={logout}>
                <Button variant="outline" size="sm">Logout</Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
