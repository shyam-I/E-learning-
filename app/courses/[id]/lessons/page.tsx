import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function LessonsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()

  const { data } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', id)
    .order('order_index')
    .limit(1)
    .single()

  if (data) {
    redirect(
      `/courses/${id}/lessons/${data.id}`
    )
  }

  return <div>No lessons found</div>
}