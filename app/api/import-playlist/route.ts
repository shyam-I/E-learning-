import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { playlistUrl, courseId } =
      await request.json()

    if (!playlistUrl || !courseId) {
      return NextResponse.json(
        {
          error:
            'Course ID and Playlist URL are required',
        },
        {
          status: 400,
        }
      )
    }

    const playlistId = new URL(
      playlistUrl
    ).searchParams.get('list')

    if (!playlistId) {
      return NextResponse.json(
        {
          error:
            'Invalid playlist URL',
        },
        {
          status: 400,
        }
      )
    }
let allItems: any[] = []
let nextPageToken = ''

do {
const response = await fetch(
`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${nextPageToken}&key=${process.env.YOUTUBE_API_KEY}`
)

const data: any = await response.json()

allItems = [
...allItems,
...(data.items || [])
]

nextPageToken =
data.nextPageToken || ''

} while (nextPageToken)

if (allItems.length === 0) {
return NextResponse.json(
{
error:
'No videos found in playlist',
},
{
status: 400,
}
)
}

    const lessons = allItems.map(
      (item: any, index: number) => ({
        course_id: courseId,

        title:
          item.snippet.title,

        description:
          item.snippet.description ||
          'Imported from YouTube',

        video_url:
          `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,

        content: '',

        order_index:
          index + 1,

        duration_minutes: 10,
      })
    )

    const { error } =
      await supabase
        .from('lessons')
        .insert(lessons)

    if (error) {
      console.error(error)

      return NextResponse.json(
        {
          error:
            error.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json({
      success: true,
      count: lessons.length,
    })
  } catch (error: any) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          error.message ||
          'Something went wrong',
      },
      {
        status: 500,
      }
    )
  }
}