'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => subscription?.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const isAuthPage = pathname?.startsWith('/auth')
  const isProtected = pathname?.startsWith('/dashboard')

  if (isAuthPage) return null

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LH</span>
            </div>
            <span className="font-bold text-lg text-foreground">KnowledgeHub</span>
          </Link>

          {/* Navigation and Search */}
          <div className="hidden md:flex items-center gap-8 flex-1 ml-8">
            {!isProtected && (
              <nav className="flex items-center gap-8">
                <Link
                  href="/"
                  className={`text-sm transition-colors ${
                    pathname === '/'
                      ? 'text-primary font-semibold'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/courses"
                  className={`text-sm transition-colors ${
                    pathname === '/courses'
                      ? 'text-primary font-semibold'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  Courses
                </Link>
                <Link
                  href="/about"
                  className={`text-sm transition-colors ${
                    pathname === '/about'
                      ? 'text-primary font-semibold'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  About
                </Link>
              </nav>
            )}

            {/* Search Bar */}
            {!isProtected && (
              <form onSubmit={handleSearch} className="ml-auto flex items-center gap-2">
                <div className="relative hidden lg:flex items-center">
                  <Search className="absolute left-3 w-4 h-4 text-foreground/50" />
                  <Input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 h-9 text-sm bg-muted border-border focus-visible:ring-primary"
                  />
                </div>
              </form>
            )}
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/dashboard" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                      Dashboard
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
