'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'

import {
  PlayCircle,
  CheckCircle,
} from 'lucide-react'

interface EnrolledCourse {
  id: string
  title: string
  description: string
  level: string
  duration_hours: number

  enrolled_at: string
  completed_at?: string

  lessons_completed?: number
  total_lessons?: number

  lessons?: {
    id: string
  }[]
}

interface Profile {
  first_name?: string
  last_name?: string
  email?: string
}

export default function DashboardPage() {

  const [enrolledCourses, setEnrolledCourses] =
    useState<EnrolledCourse[]>([])

  const [profile, setProfile] =
    useState<Profile | null>(null)

  const [loading, setLoading] =
    useState(true)

  const supabase = createClient()

  useEffect(() => {

    const fetchData = async () => {

      try {

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        // Fetch profile
        const { data: profileData } =
          await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileData) {
          setProfile(profileData)
        }

        // Fetch enrollments
        const {
          data: enrollmentData,
          error,
        } = await supabase
          .from('enrollments')
          .select(`
            id,
            course_id,
            enrolled_at,
            completed_at,

            courses (
              id,
              title,
              description,
              level,
              duration_hours,

              lessons (
                id
              )
            )
          `)
          .eq('user_id', user.id)

        if (error) {
          console.error(error)
          return
        }

        if (!enrollmentData) {
          setLoading(false)
          return
        }

        const formattedCourses =
          await Promise.all(

            enrollmentData.map(
              async (enrollment: any) => {

                // Total lessons
                const {
                  count: totalLessons,
                } = await supabase
                  .from('lessons')
                  .select('*', {
                    count: 'exact',
                    head: true,
                  })
                  .eq(
                    'course_id',
                    enrollment.course_id
                  )

                // Get lesson ids
                const {
                  data: lessonIdsData,
                } = await supabase
                  .from('lessons')
                  .select('id')
                  .eq(
                    'course_id',
                    enrollment.course_id
                  )

                const lessonIds =
                  lessonIdsData?.map(
                    (l: any) => l.id
                  ) || []

                // Completed lessons
                const {
                  count: completedLessons,
                } = await supabase
                  .from('lesson_progress')
                  .select('*', {
                    count: 'exact',
                    head: true,
                  })
                  .eq('user_id', user.id)
                  .in('lesson_id', lessonIds)
                  .not(
                    'completed_at',
                    'is',
                    null
                  )

                return {

                  id: enrollment.course_id,

                  title:
                    enrollment.courses.title,

                  description:
                    enrollment.courses
                      .description,

                  level:
                    enrollment.courses.level,

                  duration_hours:
                    enrollment.courses
                      .duration_hours,

                  lessons:
                    enrollment.courses
                      .lessons || [],

                  enrolled_at:
                    enrollment.enrolled_at,

                  completed_at:
                    enrollment.completed_at,

                  total_lessons:
                    totalLessons || 0,

                  lessons_completed:
                    completedLessons || 0,
                }
              }
            )
          )

        setEnrolledCourses(
          formattedCourses
        )

      } catch (error) {

        console.error(
          'Dashboard error:',
          error
        )

      } finally {

        setLoading(false)

      }
    }

    fetchData()

  }, [supabase])

  const calculateProgress = (
    completed: number,
    total: number
  ) => {

    if (total === 0) return 0

    return Math.round(
      (completed / total) * 100
    )
  }

  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-screen">

        <p className="text-foreground/60">
          Loading dashboard...
        </p>

      </div>
    )
  }

  const userName =
    profile?.first_name ||
    profile?.email?.split('@')[0] ||
    'Learner'

  return (

    <div className="space-y-8">

      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 border border-border">

        <div className="space-y-2">

          <h1 className="text-4xl font-bold text-foreground">
            Welcome back, {userName}!
          </h1>

          <p className="text-lg text-foreground/60">
            Continue your learning journey
          </p>

        </div>

      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white border border-border rounded-lg p-6">

          <p className="text-sm text-foreground/60">
            Courses Enrolled
          </p>

          <p className="text-4xl font-bold text-primary mt-2">
            {enrolledCourses.length}
          </p>

        </div>

        <div className="bg-white border border-border rounded-lg p-6">

          <p className="text-sm text-foreground/60">
            In Progress
          </p>

          <p className="text-4xl font-bold text-primary mt-2">
            {
              enrolledCourses.filter(
                (c) => !c.completed_at
              ).length
            }
          </p>

        </div>

        <div className="bg-white border border-border rounded-lg p-6">

          <p className="text-sm text-foreground/60">
            Completed
          </p>

          <p className="text-4xl font-bold text-primary mt-2">
            {
              enrolledCourses.filter(
                (c) => c.completed_at
              ).length
            }
          </p>

        </div>

      </div>

      {/* Courses */}
      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-foreground">
            My Courses
          </h2>

          <Link href="/courses">

            <Button variant="outline">
              Browse Courses
            </Button>

          </Link>

        </div>

        {enrolledCourses.length === 0 ? (

          <div className="bg-white border border-border rounded-lg p-12 text-center space-y-4">

            <p className="text-foreground/60">
              No enrolled courses yet
            </p>

            <Link href="/courses">

              <Button>
                Explore Courses
              </Button>

            </Link>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-6">

            {enrolledCourses.map((course) => {

              const progress =
                calculateProgress(
                  course.lessons_completed || 0,
                  course.total_lessons || 0
                )

              return (

                <div
                  key={course.id}
                  className="bg-white border border-border rounded-lg overflow-hidden"
                >

                  {/* Banner */}
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">

                    <div className="text-center">

                      <div className="text-5xl mb-2">
                        📚
                      </div>

                      <p className="text-sm text-foreground/60">
                        {course.level}
                      </p>

                    </div>

                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">

                    <div>

                      <h3 className="text-xl font-semibold text-foreground">
                        {course.title}
                      </h3>

                      <p className="text-sm text-foreground/60 mt-2">
                        {course.description}
                      </p>

                    </div>

                    {/* Progress */}
                    <div className="space-y-2">

                      <div className="flex justify-between text-sm">

                        <span className="text-foreground/60">
                          {course.lessons_completed}/
                          {course.total_lessons} lessons
                        </span>

                        <span className="font-semibold text-primary">
                          {progress}%
                        </span>

                      </div>

                      <div className="h-2 bg-muted rounded-full overflow-hidden">

                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-border">

                      {course.completed_at ? (

                        <div className="flex items-center gap-2 text-green-600">

                          <CheckCircle className="w-5 h-5" />

                          <span className="font-medium">
                            Completed
                          </span>

                        </div>

                      ) : (

                        <Link
                          href={
                            course.lessons?.[0]?.id
                              ? `/courses/${course.id}/lessons/${course.lessons[0].id}`
                              : `/courses/${course.id}`
                          }
                        >

                          <Button
                            className="w-full gap-2"
                            variant="ghost"
                          >

                            <PlayCircle className="w-4 h-4" />

                            Continue Learning

                          </Button>

                        </Link>

                      )}

                    </div>

                  </div>

                </div>

              )
            })}

          </div>

        )}

      </div>

    </div>
  )
}