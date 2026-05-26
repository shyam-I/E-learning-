import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, Target, Zap } from 'lucide-react'

export const metadata = {
  title: 'About LearnHub - Our Mission & Values',
  description: 'Learn about LearnHub&apos;s mission to democratize education and empower learners worldwide.',
}

export default function AboutPage() {
  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
              About <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LearnHub</span>
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              We&apos;re on a mission to make quality education accessible to everyone, everywhere, at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
              <p className="text-foreground/70 leading-relaxed">
                At LearnHub, we believe that education is the foundation for personal and professional growth. Our mission is to democratize learning by providing world-class courses that are accessible, affordable, and engaging for learners of all backgrounds and skill levels.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Whether you&apos;re just starting your coding journey or looking to master advanced data science concepts, LearnHub is here to guide you every step of the way.
              </p>
            </div>
            <div className="hidden md:flex justify-center items-center">
              <div className="w-full h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-border flex items-center justify-center">
                <Target className="w-24 h-24 text-primary/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Our Core Values</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              These principles guide everything we do at LearnHub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="p-8 rounded-xl border border-border hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Community First</h3>
              <p className="text-foreground/60">
                We foster a supportive community where learners help each other grow. Education is better when shared and celebrated together.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-8 rounded-xl border border-border hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Quality & Excellence</h3>
              <p className="text-foreground/60">
                Every course is meticulously crafted by industry experts. We never compromise on content quality or user experience.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-8 rounded-xl border border-border hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Accessibility</h3>
              <p className="text-foreground/60">
                We believe quality education should be available to everyone. LearnHub is designed to be inclusive and affordable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Our Story</h2>
          </div>

          <div className="space-y-8 text-foreground/70 leading-relaxed">
            <p>
              LearnHub was born from a simple observation: quality education is too expensive and too difficult to access for most people. Our founders, all passionate about learning and teaching, realized that modern technology could bridge this gap.
            </p>

            <p>
              Starting as a small project in 2023, LearnHub has grown into a vibrant learning platform with thousands of satisfied learners. What began with a handful of courses in web development has expanded to include data science, mobile development, design, and cloud computing.
            </p>

            <p>
              Today, we continue our mission to empower learners worldwide. We&apos;re committed to expanding our course library, improving our platform, and building a community where everyone feels welcome to learn and grow.
            </p>

            <p>
              We believe that the future is built by continuous learners, and we&apos;re honored to be part of your learning journey.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">1000+</p>
              <p className="text-foreground/70">Active Learners</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">50+</p>
              <p className="text-foreground/70">Expert Courses</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">500+</p>
              <p className="text-foreground/70">Lessons Created</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">95%</p>
              <p className="text-foreground/70">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Ready to Join Our Community?</h2>
            <p className="text-lg text-foreground/60">
              Start your learning journey today and discover the power of accessible education.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Browse Courses
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="lg" variant="outline">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
