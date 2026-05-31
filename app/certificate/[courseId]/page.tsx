'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { createClient }
from '../../../lib/supabase/client'

interface CertificateData {

  certificate_no: string

  issued_at: string

  courses: {
    title: string
  }

  profiles: {
    first_name: string
    last_name: string
  }
}

export default function CertificatePage() {

  const params = useParams()

  const supabase = createClient()

  const [certificate, setCertificate] =
    useState<CertificateData | null>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    fetchCertificate()

  }, [])

  const fetchCertificate = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return
const { data, error } =
  await supabase
    .from('certificates')
    .select(`
      certificate_no,
      issued_at,

      courses (
        title
      )
    `)
    .eq('course_id', params.courseId)
    .single()
        .eq('user_id', user.id)
        .eq(
          'course_id',
          params.courseId
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

        {/* Print Button */}
        <div className="flex justify-end print:hidden">

          <button
            onClick={handlePrint}
            className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-all"
          >

            Download / Print Certificate

          </button>

        </div>

        {/* Certificate */}
        <div className="bg-white border-[12px] border-primary rounded-2xl p-16 shadow-2xl text-center space-y-8">

          {/* Header */}
          <div className="space-y-4">

            <h1 className="text-5xl font-bold text-primary">

              Certificate of Completion

            </h1>

            <p className="text-xl text-foreground/60">

              This certifies that

            </p>

          </div>

          {/* Student */}
          <div>

            <h2 className="text-6xl font-bold text-foreground">

              {certificate.profiles?.first_name}{' '}
              {certificate.profiles?.last_name}

            </h2>

          </div>

          {/* Course */}
          <div className="space-y-4">

            <p className="text-2xl text-foreground/70">

              has successfully completed the course

            </p>

            <h3 className="text-4xl font-semibold text-primary">

              {certificate.courses?.title}

            </h3>

          </div>

          {/* Footer */}
          <div className="pt-12 flex justify-between items-end">

            <div className="text-left space-y-2">

              <p className="text-sm text-foreground/60">

                Certificate No

              </p>

              <p className="font-semibold">

                {certificate.certificate_no}

              </p>

            </div>

            <div className="text-center">

              <div className="border-t border-black pt-2 w-48">

                Authorized Signature

              </div>

            </div>

            <div className="text-right space-y-2">

              <p className="text-sm text-foreground/60">

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