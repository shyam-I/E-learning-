'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'

interface CertificateData {
  certificate_no: string
  issued_at: string

  courses: {
    title: string
  }
}

export default function CertificatePage() {
  const params = useParams()

  const supabase = createClient()

  const [certificate, setCertificate] =
    useState<CertificateData | null>(null)
  const [studentName, setStudentName] =
    useState('')
  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchCertificate()
  }, [])

  const fetchCertificate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { data: profileData } =
      await supabase
        .from('profiles')
        .select('first_name,last_name')
        .eq('id', user.id)
        .single()

    if (profileData) {
      setStudentName(
        `${profileData.first_name} ${profileData.last_name}`
      )
    }


    const { data, error } = await supabase
      .from('certificates')
      .select(`
        certificate_no,
        issued_at,
        courses (
          title
        )
      `)
      .eq('user_id', user.id)
      .eq(
        'course_id',
        params.courseId as string
      )
      .single()

    if (error) {
      console.error(error)
    } else {
      setCertificate(data as any)
    }

    setLoading(false)
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading certificate...
      </div>
    )
  }

  if (!certificate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Certificate not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted py-12 px-4">

      <div className="max-w-5xl mx-auto space-y-6">

        <div className="flex justify-end print:hidden">
          <button
            onClick={handlePrint}
            className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10"
          >
            Download / Print Certificate
          </button>
        </div>

        <div className="bg-white border-[12px] border-blue-600 rounded-2xl p-16 shadow-2xl text-center space-y-8">

          <div className="space-y-3">

            <h2 className="text-3xl font-bold text-blue-600">
              KnowledgeHub
            </h2>

            <p className="text-gray-500">
              Online Learning Platform
            </p>

            <h1 className="text-5xl font-bold text-blue-600">
              Certificate of Completion
            </h1>

          </div>

          <div className="space-y-4">

            <p className="text-2xl text-gray-600">
              This certifies that
            </p>

            <h2 className="text-6xl font-bold text-black">
              {studentName}
            </h2>
            <p className="text-2xl text-gray-600">
              has successfully completed the course
            </p>

            <h3 className="text-4xl font-semibold text-blue-600">
              {certificate.courses?.title}
            </h3>

          </div>

          <div className="pt-12 flex justify-between items-end">

            <div>
              <p className="text-sm text-gray-500">
                Certificate No
              </p>

              <p className="font-semibold">
                {certificate.certificate_no}
              </p>
            </div>

          <div className="text-center">

  <p
    className="text-2xl italic"
    style={{ fontFamily: 'cursive' }}
  >
    Shyam 
  </p>

  <div className="border-t border-black pt-2 w-48">
    Authorized Signature
  </div>

  <p className="text-sm text-gray-500">
    Founder & CEO, KnowledgeHub
  </p>

</div>

            <div>
              <p className="text-sm text-gray-500">
                Issued On
              </p>

              <p className="font-semibold">
                {new Date(
                  certificate.issued_at
                ).toLocaleDateString()}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}