import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Fetch course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()

    if (courseError) {
      console.error('Course fetch error:', courseError)

      return NextResponse.json(
        { error: courseError.message },
        { status: 500 }
      )
    }

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Fetch lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', id)
      .order('order_index', { ascending: true })

    if (lessonsError) {
      console.error('Lessons fetch error:', lessonsError)

      return NextResponse.json(
        { error: lessonsError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ...course,
      lessons,
    })

  } catch (error) {
    console.error('Error fetching course:', error)

    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}