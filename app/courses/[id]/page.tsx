'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Clock, Users, Award, PlayCircle, ChevronDown } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description?: string
  order_index: number
  duration_minutes?: number
}

interface Course {
  id: string
  title: string
  description: string
  level: string
  duration_hours: number
  thumbnail_url?: string
  instructor_id: string
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [enrolled, setEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)

        // Fetch course
        const { data: courseData } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single()

        if (courseData) {
          setCourse(courseData)

          // Check if user is enrolled
          if (currentUser) {
            const { data: enrollmentData } = await supabase
              .from('enrollments')
              .select('id')
              .eq('user_id', currentUser.id)
              .eq('course_id', id)
              .single()

            setEnrolled(!!enrollmentData)
          }

          // Fetch lessons
          const { data: lessonsData } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', id)
            .order('order_index')

          setLessons(lessonsData || [])
        }
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, supabase])

  const handleEnroll = async () => {
    if (!user) {
      router.push('/auth/sign-up')
      return
    }

    try {
      setEnrolling(true)
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: id,
        })

      if (error) throw error

      setEnrolled(true)
      router.push(`/dashboard`)
    } catch (error) {
      console.error('Error enrolling:', error)
      alert('Failed to enroll in course')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Loading course...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-foreground/60 text-lg">Course not found</p>
          <Link href="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-primary font-semibold text-sm uppercase">{course.level}</p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
                {course.title}
              </h1>
              <p className="text-xl text-foreground/70 max-w-2xl">
                {course.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-foreground/60">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{course.duration_hours} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>1000+ students</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Certificate included</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Image */}
            <div className="h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PlayCircle className="w-20 h-20 text-primary mx-auto mb-4" />
                <p className="text-foreground/60">Course Preview</p>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">About this course</h2>
              <p className="text-foreground/70 leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Lessons Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Course Content</h2>
              <p className="text-foreground/60">{lessons.length} lessons</p>

              <div className="space-y-2 border border-border rounded-lg overflow-hidden">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                          {lesson.order_index}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{lesson.title}</p>
                          {lesson.duration_minutes && (
                            <p className="text-sm text-foreground/60">{lesson.duration_minutes} min</p>
                          )}
                        </div>
                      </div>
                      {enrolled && (
                        <PlayCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white border border-border rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-foreground/60 text-sm">Enroll now to get started</p>
                {enrolled ? (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                    <p className="text-green-700 font-semibold text-sm">✓ You&apos;re enrolled</p>
                  </div>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                )}
              </div>

              {enrolled && (
                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              )}

              {/* Course Stats */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Difficulty</p>
                  <p className="font-semibold text-foreground">{course.level}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Duration</p>
                  <p className="font-semibold text-foreground">{course.duration_hours} hours</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Lessons</p>
                  <p className="font-semibold text-foreground">{lessons.length} lessons</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
