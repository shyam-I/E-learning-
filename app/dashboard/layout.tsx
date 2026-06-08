import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, BookOpen, User, LogOut } from 'lucide-react'
import Image from 'next/image'
export const metadata = {
  title: 'Dashboard - KnowledgeHub',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 md:grid-cols-4 min-h-screen">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-white border-r border-border p-6 space-y-8">
          {/* Logo */}
<Link
  href="/dashboard"
  className="flex items-center gap-3"
>

  <Image
    src="/main logo.jpeg"
    alt="KnowledgeHub Logo"
    width={45}
    height={45}
    className="rounded-xl object-cover"
    priority
  />

  <span className="font-bold text-xl">
    KnowledgeHub
  </span>

</Link>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Home className="w-5 h-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <BookOpen className="w-5 h-5" />
                Browse Courses
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <User className="w-5 h-5" />
                Profile
              </Button>
            </Link>
          </nav>

          {/* Logout */}
          <div className="pt-6 border-t border-border">
            <form action="/auth/logout" method="post">
              <Button variant="outline" className="w-full justify-start gap-3" type="submit">
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </form>
          </div>
        </aside>

        {/* Main content */}
        <main className="md:col-span-3 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
