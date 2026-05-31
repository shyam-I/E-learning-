'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Search, Clock, Star } from 'lucide-react'

interface Course {
  image_url: string
  id: string
  title: string
  description: string
  level: string
  duration_hours: number
  thumbnail_url?: string
  category_id?: string
  instructor_id?: string
}

interface Category {
  id: string
  name: string
}

function CoursesContent() {

  const searchParams = useSearchParams()

  const initialSearch =
    searchParams.get('search') || ''

  const [courses, setCourses] =
    useState<Course[]>([])

  const [categories, setCategories] =
    useState<Category[]>([])

  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null)

  const [searchQuery, setSearchQuery] =
    useState(initialSearch)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    const fetchData = async () => {

      try {

        // Fetch categories
        const categoriesRes =
          await fetch('/api/categories')

        const categoriesJson =
          await categoriesRes.json()

        const categoriesData =
          Array.isArray(categoriesJson)
            ? categoriesJson
            : categoriesJson.data || []

        setCategories(categoriesData)

        // Fetch courses
        const coursesRes =
          await fetch('/api/courses')

        const coursesJson =
          await coursesRes.json()

        const coursesData =
          Array.isArray(coursesJson)
            ? coursesJson
            : coursesJson.data || []

        setCourses(coursesData)

      } catch (error) {

        console.error(
          'Error fetching data:',
          error
        )

      } finally {

        setLoading(false)

      }
    }

    fetchData()

  }, [])

  // Filter courses
  const filteredCourses =
    courses.filter((course) => {

      const title =
        course.title || ''

      const description =
        course.description || ''

      const matchesSearch =
        title
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          ) ||

        description
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )

      const matchesCategory =
        !selectedCategory ||
        course.category_id ===
          selectedCategory

      return (
        matchesSearch &&
        matchesCategory
      )
    })

  return (

    <div className="min-h-screen bg-background py-12">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 text-center space-y-4">

          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Explore Courses
          </h1>

          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            Discover our comprehensive collection of expert-led courses
          </p>

        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-6">

          {/* Search */}
          <div className="relative">

            <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />

            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="pl-10"
            />

          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">

            <Button
              variant={
                selectedCategory === null
                  ? 'default'
                  : 'outline'
              }
              onClick={() =>
                setSelectedCategory(null)
              }
              className="rounded-full"
            >
              All
            </Button>

            {categories.map((category) => (

              <Button
                key={category.id}
                variant={
                  selectedCategory ===
                  category.id
                    ? 'default'
                    : 'outline'
                }
                onClick={() =>
                  setSelectedCategory(
                    category.id
                  )
                }
                className="rounded-full"
              >
                {category.name}
              </Button>

            ))}

          </div>

        </div>

        {/* Loading */}
        {loading ? (

          <div className="flex items-center justify-center py-20">

            <p className="text-foreground/60 text-lg">
              Loading courses...
            </p>

          </div>

        ) : filteredCourses.length === 0 ? (

          <div className="flex items-center justify-center py-20">

            <p className="text-foreground/60 text-lg">
              No courses found.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredCourses.map((course) => (

              <Link
                key={course.id}
                href={`/courses/${course.id}`}
              >

                <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
<div className="h-52 overflow-hidden">

  <img
    src={
      course.image_url ||
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
    }
    alt={course.title}
    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
  />

</div>

<p className="text-xs break-all">
  {course.image_url}
</p> 

                  {/* Content */}
                  <div className="p-6 space-y-4">

                    {/* Title */}
                    <div>

                      <h3 className="text-xl font-semibold text-foreground line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-sm text-foreground/60 mt-2 line-clamp-3">
                        {course.description}
                      </p>

                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-foreground/60">

                      <div className="flex items-center gap-1">

                        <Clock className="w-4 h-4" />

                        <span>
                          {course.duration_hours} hrs
                        </span>

                      </div>

                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {course.level}
                      </span>

                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border">

                      <div className="flex gap-0.5">

                        {[...Array(5)].map((_, i) => (

                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />

                        ))}

                      </div>

                      <span className="text-sm text-foreground/60">
                        4.8
                      </span>

                    </div>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </div>
  )
}

export default function CoursesPage() {

  return (

    <Suspense fallback={<div>Loading...</div>}>

      <CoursesContent />

    </Suspense>

  )
}