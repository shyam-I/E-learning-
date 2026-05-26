import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)

    const userId = searchParams.get('userId')
    const lessonId = searchParams.get('lessonId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)

    if (lessonId) {
      query = query.eq('lesson_id', lessonId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Error fetching progress:', error)

    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const body = await request.json()

    const {
      userId,
      lessonId,
      completed_at,
      watched_seconds
    } = body

    if (!userId || !lessonId) {
      return NextResponse.json(
        { error: 'userId and lessonId are required' },
        { status: 400 }
      )
    }

    // Check existing progress
    const { data: existingProgress } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single()

    let result
    let error

    if (existingProgress) {
      // Update existing progress
      const response = await supabase
        .from('lesson_progress')
        .update({
          watched_seconds:
            watched_seconds ?? existingProgress.watched_seconds,

          completed_at:
            completed_at ?? existingProgress.completed_at,
        })
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .select()
        .single()

      result = response.data
      error = response.error

    } else {
      // Create new progress
      const response = await supabase
        .from('lesson_progress')
        .insert([
          {
            user_id: userId,
            lesson_id: lessonId,
            watched_seconds: watched_seconds || 0,
            completed_at: completed_at || null,
          },
        ])
        .select()
        .single()

      result = response.data
      error = response.error
    }

    if (error) {
      console.error('Supabase error:', error)

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(result, { status: 201 })

  } catch (error) {
    console.error('Error saving progress:', error)

    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    )
  }
}