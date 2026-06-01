'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface Question {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
}

export default function AssessmentPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [questions, setQuestions] =
    useState<Question[]>([])

  const [answers, setAnswers] =
    useState<{ [key: string]: string }>({})

  const [loading, setLoading] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    const { data, error } =
      await supabase
        .from('assessments')
        .select('*')
        .eq('course_id', params.id)

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setQuestions(data || [])
    setLoading(false)
  }

  const handleAnswer = (
    questionId: string,
    answer: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    let score = 0

    questions.forEach((question) => {
      if (
        answers[question.id] ===
        question.correct_answer
      ) {
        score++
      }
    })

    const percentage = Math.round(
      (score / questions.length) * 100
    )

    const passed = percentage >= 50

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Please login first')
      return
    }

   const { error: resultError } =
  await supabase
    .from('assessment_results')
    .insert({
      user_id: user.id,
      course_id: params.id,
      score: percentage,
      passed,
    })

    if (resultError) {
  console.error(resultError)

  alert(
    JSON.stringify(resultError, null, 2)
  )

  setSubmitting(false)
  return
}

   if (passed) {

  const { data: existingCertificate } =
    await supabase
      .from('certificates')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', params.id)
      .maybeSingle()


      alert(
        `Congratulations! You passed with ${percentage}%`
      )

      router.push(
        `/certificate/${params.id}`
      )
    } else {
      alert(
        `You scored ${percentage}%.\nMinimum passing score is 70%.`
      )
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading Assessment...
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">
          No Assessment Available
        </h1>

        <p className="text-gray-500">
          Assessment questions have not
          been added for this course yet.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Course Assessment
        </h1>

        <p className="text-gray-500 mt-2">
          Pass Score: 70%
        </p>
      </div>

      <div className="space-y-6">

        {questions.map(
          (question, index) => (
            <div
              key={question.id}
              className="border rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold mb-4">
                {index + 1}.{' '}
                {question.question}
              </h2>

              <div className="space-y-3">

                {[
                  question.option_a,
                  question.option_b,
                  question.option_c,
                  question.option_d,
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      handleAnswer(
                        question.id,
                        option
                      )
                    }
                    className={`w-full text-left border rounded-lg p-4 transition ${
                      answers[
                        question.id
                      ] === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}

              </div>
            </div>
          )
        )}

      </div>

      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full mt-8"
      >
        {submitting
          ? 'Submitting...'
          : 'Submit Assessment'}
      </Button>

    </div>
  )
}