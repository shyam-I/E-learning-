import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch all courses
    const { data, error } = await supabase
      .from('courses')
      .select('*')

    console.log('COURSES DATA:', data)
    console.log('SUPABASE ERROR:', error)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('SERVER ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch courses',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const body = await request.json()

    const { data, error } = await supabase
      .from('courses')
      .insert([body])
      .select()
      .single()

    console.log('INSERT DATA:', data)
    console.log('INSERT ERROR:', error)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('POST ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create course',
      },
      { status: 500 }
    )
  }
}