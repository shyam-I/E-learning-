'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  const [stats, setStats] = useState({
    enrollments: 0,
    lessons: 0,
    certificates: 0,
    xp: 0,
    level: 'Beginner',
  })

  const [achievements, setAchievements] =
    useState<string[]>([])

  const [progressPercent, setProgressPercent] =
    useState(0)

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      setUser(user)

      const { data: profileData } =
        await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

      setProfile(profileData)

      const { count: enrollments } =
        await supabase
          .from('enrollments')
          .select('*', {
            count: 'exact',
            head: true,
          })
          .eq('user_id', user.id)

      const { count: lessons } =
        await supabase
          .from('lesson_progress')
          .select('*', {
            count: 'exact',
            head: true,
          })
          .eq('user_id', user.id)

      const { count: certificates } =
        await supabase
          .from('certificates')
          .select('*', {
            count: 'exact',
            head: true,
          })
          .eq('user_id', user.id)

      const xp = (lessons || 0) * 10

      let level = 'Beginner'

      if (xp >= 3000) {
        level = 'Expert'
      } else if (xp >= 1500) {
        level = 'Advanced'
      } else if (xp >= 500) {
        level = 'Intermediate'
      }

      setStats({
        enrollments: enrollments || 0,
        lessons: lessons || 0,
        certificates: certificates || 0,
        xp,
        level,
      })

      const xpProgress =
        Math.min((xp / 500) * 100, 100)

      setProgressPercent(xpProgress)

      const earnedAchievements = []

      if ((enrollments || 0) >= 1) {
        earnedAchievements.push(
          '📚 First Enrollment'
        )
      }

      if ((lessons || 0) >= 1) {
        earnedAchievements.push(
          '🎯 First Lesson Completed'
        )
      }

      if ((lessons || 0) >= 4) {
        earnedAchievements.push(
          '🔥 Completed 4 Lessons'
        )
      }

      if (xp >= 40) {
        earnedAchievements.push(
          '⭐ Earned 40 XP'
        )
      }

      setAchievements(
        earnedAchievements
      )
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">

      <div className="bg-white rounded-xl border p-8 mb-8">

        <h1 className="text-3xl font-bold">
          {profile?.first_name || 'Student'}{' '}
          {profile?.last_name || ''}
        </h1>

        <p className="text-gray-600 mt-2">
          {user?.email}
        </p>

        <p className="mt-4 text-gray-700">
          {profile?.bio ||
            'No bio added yet'}
        </p>

        <div className="mt-4">
          <span className="px-3 py-1 bg-blue-100 rounded-full">
            ⭐ {stats.level}
          </span>
        </div>

      </div>

      <div className="grid md:grid-cols-4 gap-4">

        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-sm text-gray-500">
            Courses Enrolled
          </h3>
          <p className="text-3xl font-bold">
            {stats.enrollments}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-sm text-gray-500">
            Lessons Completed
          </h3>
          <p className="text-3xl font-bold">
            {stats.lessons}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-sm text-gray-500">
            Certificates
          </h3>
          <p className="text-3xl font-bold">
            {stats.certificates}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-sm text-gray-500">
            XP Points
          </h3>
          <p className="text-3xl font-bold">
            {stats.xp}
          </p>
        </div>

      </div>

      <div className="bg-white border rounded-xl p-6 mt-8">

        <h2 className="text-xl font-bold mb-4">
          Level Progress
        </h2>

        <p className="mb-3">
          {stats.xp} / 500 XP to Intermediate
        </p>

        <div className="w-full bg-gray-200 rounded-full h-4">

          <div
            className="bg-green-600 h-4 rounded-full"
            style={{
              width: `${progressPercent}%`,
            }}
          />

        </div>

      </div>

      <div className="bg-white border rounded-xl p-6 mt-8">

        <h2 className="text-xl font-bold mb-4">
          Achievements
        </h2>

        <div className="space-y-3">

          {achievements.map(
            (achievement, index) => (
              <div
                key={index}
                className="border rounded-lg p-3"
              >
                {achievement}
              </div>
            )
          )}

        </div>

      </div>

    </div>
  )
}