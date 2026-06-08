import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react'
import Image from 'next/image'
export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-64px)] flex items-center bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
                Learn Anything,{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Anytime
                </span>
              </h1>
              <p className="text-xl text-foreground/70 leading-relaxed max-w-lg">
                Master new skills with our comprehensive online courses. From technology to business, discover expert-led learning experiences designed for your success.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/courses">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Explore Courses
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-primary">1000+</p>
                <p className="text-sm text-foreground/60">Active Learners</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">50+</p>
                <p className="text-sm text-foreground/60">Expert Courses</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">95%</p>
                <p className="text-sm text-foreground/60">Satisfaction Rate</p>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="hidden md:flex justify-center items-center">

            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">

              <Image
                src="\logo.png"
                alt="E-Learning Banner"
                fill
                priority
                className="object-cover hover:scale-105 transition duration-500"
              />

            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Why Choose LearnHub?</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              We provide everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-xl border border-border hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Expert-Curated Courses</h3>
              <p className="text-foreground/60">
                Learn from industry experts who share their real-world knowledge and practical experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-xl border border-border hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Community Support</h3>
              <p className="text-foreground/60">
                Connect with fellow learners, ask questions, and grow together in our vibrant community.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-xl border border-border hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Certificates & Progress</h3>
              <p className="text-foreground/60">
                Earn certificates upon completion and track your progress through detailed dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Ready to Start Learning?</h2>
            <p className="text-lg text-foreground/60">
              Join thousands of learners and unlock your potential today
            </p>
          </div>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Sign Up Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
