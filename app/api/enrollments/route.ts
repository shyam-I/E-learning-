import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'


export async function GET(request: NextRequest) {
  try {
   
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const enrollments = await supabase
      .from('enrollments')
      .select('*, courses(*)')
      .eq('user_id', userId)

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const body = await request.json()
    const { userId, courseId } = body

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'userId and courseId are required' },
        { status: 400 }
      )
    }

    // Check if already enrolled
const { data: existingEnrollment } = await supabase
  .from('enrollments')
  .select('*')
  .eq('user_id', userId)
  .eq('course_id', courseId)
  .single()

if (existingEnrollment) {
  return NextResponse.json(
    { error: 'Already enrolled' },
    { status: 409 }
  )
}

// Create enrollment
const { data: enrollment, error } = await supabase
  .from('enrollments')
  .insert([
    {
      user_id: userId,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
    },
  ])
  .select(`
    *,
    courses (
      id,
      title,
      thumbnail_url
    )
  `)
  .single()

if (error) {
  console.error('Supabase error:', error)

  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  )
}

return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error('Error creating enrollment:', error)
    return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 500 })
  }
}
