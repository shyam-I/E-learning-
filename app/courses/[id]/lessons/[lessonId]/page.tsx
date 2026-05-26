'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import {
  PlayCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description?: string
  content?: string
  order_index: number
  duration_minutes?: number
  video_url?: string
}

interface Course {
  id: string
  title: string
  description: string
  
}


export default function LessonsPage() {
  const { id: course_id } = useParams()

  const [course, setCourse] = useState<Course | null>(null)

  const [lessons, setLessons] = useState<Lesson[]>([])

  const [currentLesson, setCurrentLesson] =
    useState<Lesson | null>(null)

  const [completedLessons, setCompletedLessons] =
    useState<Set<string>>(new Set())

  const [loading, setLoading] = useState(true)

  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()

        setUser(currentUser)

        // Fetch course
        const { data: courseData } = await supabase
          .from('courses')
          .select('*')
          .eq('id', course_id)
          .single()

        setCourse(courseData)

        // Fetch lessons
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', course_id)
          .order('order_index')

        setLessons(lessonsData || [])

        if (lessonsData && lessonsData.length > 0) {
          setCurrentLesson(lessonsData[0])
        }

        // Fetch completed lessons
        if (currentUser && lessonsData) {
          const lessonIds = lessonsData.map((l) => l.id)

          const { data: progressData } = await supabase
            .from('lesson_progress')
            .select('lesson_id')
            .eq('user_id', currentUser.id)
            .in('lesson_id', lessonIds)
            .not('completed_at', 'is', null)

          setCompletedLessons(
            new Set(
              progressData?.map((p) => p.lesson_id) || []
            )
          )
        }
      } catch (error) {
        console.error('Error fetching lessons:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [course_id, supabase])

  const handleMarkComplete = async () => {
    if (!currentLesson || !user) return

    try {
      const { data: existingProgress } = await supabase
        .from('lesson_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', currentLesson.id)
        .single()

      if (existingProgress) {
        await supabase
          .from('lesson_progress')
          .update({
            completed_at: new Date().toISOString(),
          })
          .eq('id', existingProgress.id)
      } else {
        await supabase
          .from('lesson_progress')
          .insert({
            user_id: user.id,
            lesson_id: currentLesson.id,
            completed_at: new Date().toISOString(),
          })
      }

      setCompletedLessons(
        (prev) => new Set([...prev, currentLesson.id])
      )
    } catch (error) {
      console.error(
        'Error marking lesson complete:',
        error
      )
    }
  }

  const goToPreviousLesson = () => {
    if (!currentLesson) return

    const currentIndex = lessons.findIndex(
      (l) => l.id === currentLesson.id
    )

    if (currentIndex > 0) {
      setCurrentLesson(lessons[currentIndex - 1])
    }
  }

  const goToNextLesson = () => {
    if (!currentLesson) return

    const currentIndex = lessons.findIndex(
      (l) => l.id === currentLesson.id
    )

    if (currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground/60">
          Loading lessons...
        </p>
      </div>
    )
  }

  if (!course || lessons.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-foreground/60">
            No lessons found
          </p>

          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentIndex = lessons.findIndex(
    (l) => l.id === currentLesson?.id
  )

  const isCompleted = currentLesson
    ? completedLessons.has(currentLesson.id)
    : false

  const progress = Math.round(
    (completedLessons.size / lessons.length) * 100
  )

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8 space-y-4">

          <Link
            href="/dashboard"
            className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />

            Back to Dashboard
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {course.title}
            </h1>

            <p className="text-foreground/60 mt-1">
              {currentLesson?.title}
            </p>
          </div>

        </div>

        <div className="grid lg:grid-cols-4 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">

           {/* Video Player */}
<div className="w-full aspect-video rounded-lg overflow-hidden border border-border bg-black">

  {currentLesson?.video_url ? (

    currentLesson.video_url.includes('youtube.com') ||
    currentLesson.video_url.includes('youtu.be') ? (

      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${
          currentLesson.video_url.includes('youtu.be/')
            ? currentLesson.video_url
                .split('youtu.be/')[1]
                .split('?')[0]
            : new URL(
                currentLesson.video_url
              ).searchParams.get('v')
        }`}
        title={currentLesson.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

    ) : (

      <video
        controls
        className="w-full h-full"
      >

        <source
          src={currentLesson.video_url}
          type="video/mp4"
        />

      </video>

    )

  ) : (

    <div className="w-full h-full flex items-center justify-center text-white">

      No video available

    </div>

  )}

</div>

            {/* Lesson Content */}
            <div className="bg-white border border-border rounded-lg p-8 space-y-4">

              <div>

                <h2 className="text-2xl font-bold text-foreground">
                  {currentLesson?.title}
                </h2>

                {currentLesson?.duration_minutes && (
                  <p className="text-sm text-foreground/60 mt-2">
                    Duration: {currentLesson.duration_minutes} minutes
                  </p>
                )}

              </div>

              {currentLesson?.description && (

                <div className="pt-4 border-t border-border">

                  <h3 className="font-semibold text-foreground mb-2">
                    Description
                  </h3>

                  <p className="text-foreground/70 leading-relaxed">
                    {currentLesson.description}
                  </p>

                </div>

              )}

              {currentLesson?.content && (

                <div className="pt-4 border-t border-border">

                  <h3 className="font-semibold text-foreground mb-2">
                    Lesson Notes
                  </h3>

                  <div className="prose prose-sm max-w-none text-foreground/70">
                    {currentLesson.content}
                  </div>

                </div>

              )}

            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">

              <Button
                onClick={handleMarkComplete}
                disabled={isCompleted}
                className={
                  isCompleted
                    ? 'bg-green-600 hover:bg-green-600'
                    : 'bg-primary hover:bg-primary/90'
                }
              >

                {isCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Completed
                  </>
                ) : (
                  'Mark as Complete'
                )}

              </Button>

            </div>

            {/* Lesson Navigation */}
            <div className="flex gap-4 pt-4 border-t border-border">

              <Button
                onClick={goToPreviousLesson}
                disabled={currentIndex === 0}
                variant="outline"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>

              <Button
                onClick={goToNextLesson}
                disabled={
                  currentIndex === lessons.length - 1
                }
                variant="outline"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>

            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">

            <div className="sticky top-20 space-y-4">

              {/* Progress */}
              <div className="bg-white border border-border rounded-lg p-4 space-y-2">

                <p className="text-sm font-semibold text-foreground">
                  Course Progress
                </p>

                <div className="space-y-1">

                  <div className="flex justify-between text-xs text-foreground/60">

                    <span>
                      {completedLessons.size} of {lessons.length}
                    </span>

                    <span>
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

              </div>

              {/* Lessons List */}
              <div className="bg-white border border-border rounded-lg overflow-hidden">

                <div className="p-4 border-b border-border">

                  <p className="font-semibold text-foreground text-sm">
                    Lessons
                  </p>

                </div>

                <div className="divide-y divide-border max-h-96 overflow-y-auto">

                  {lessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course_id}/lessons/${lesson.id}`}
                      className={`block w-full p-4 text-left transition-colors ${currentLesson?.id === lesson.id
                          ? 'bg-primary/10 border-l-2 border-primary'
                          : 'hover:bg-muted'
                        }`}
                    >

                      <div className="flex items-start gap-2">

                        {completedLessons.has(lesson.id) ? (

                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />

                        ) : (

                          <div className="w-5 h-5 rounded-full border border-foreground/30 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">

                            <span className="text-foreground/60">
                              {lesson.order_index}
                            </span>

                          </div>

                        )}

                        <div className="min-w-0">

                          <p
                            className={`text-sm font-medium truncate ${currentLesson?.id === lesson.id
                                ? 'text-foreground'
                                : 'text-foreground/70'
                              }`}
                          >
                            {index + 1}. {lesson.title}
                          </p>

                          {lesson.duration_minutes && (
                            <p className="text-xs text-foreground/50">
                              {lesson.duration_minutes} min
                            </p>
                          )}

                        </div>

                      </div>

                    </Link>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}