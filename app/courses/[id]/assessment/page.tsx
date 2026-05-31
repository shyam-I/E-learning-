'use client'

import { useEffect, useState } from 'react'

import {
  useParams,
  useRouter,
} from 'next/navigation'

import { createClient }
from '../../../../lib/supabase/client'

import { Button }
from '../../../../components/ui/button'

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
    useState<{
      [key: string]: string
    }>({})

  const [loading, setLoading] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)

  useEffect(() => {

    fetchQuestions()

  }, [])

  // FETCH LESSONS & AUTO GENERATE QUESTIONS
  const fetchQuestions = async () => {

    console.log('Fetching lessons...')

    const {
      data: lessons,
      error,
    } = await supabase
      .from('lessons')
      .select('*')
      .limit(10)

    console.log('Lessons:', lessons)

    if (error) {

      console.error(error)

      setLoading(false)

      return
    }

    if (
      !lessons ||
      lessons.length === 0
    ) {

      console.log('No lessons found')

      setQuestions([])

      setLoading(false)

      return
    }

    // AUTO GENERATE QUESTIONS
    const generatedQuestions =
      lessons.map((lesson: any) => ({

        id: lesson.id,

        question:
          `What is taught in "${lesson.title}"?`,

        option_a:
          lesson.title,

        option_b:
          'Database Management',

        option_c:
          'Cyber Security',

        option_d:
          'Cloud Computing',

        correct_answer:
          lesson.title,

      }))

    console.log(
      'Generated Questions:',
      generatedQuestions
    )

    setQuestions(generatedQuestions)

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

    const percentage =
      Math.round(
        (score / questions.length) * 100
      )

    const passed =
      percentage >= 70

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // SAVE RESULT
    await supabase
      .from('assessment_results')
      .insert({

        user_id: user.id,

        course_id: params.id,

        score: percentage,

        passed,

      })

    // GENERATE CERTIFICATE
    if (passed) {

      await supabase
        .from('certificates')
        .insert({

          user_id: user.id,

          course_id: params.id,

          certificate_no:
            `CERT-${Date.now()}`,

        })

      router.push(
        `/certificate/${params.id}`
      )

    } else {

      alert(
        `You scored ${percentage}%.
Minimum passing score is 70%.`
      )
    }

    setSubmitting(false)
  }

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-screen">

        Loading assessment...

      </div>
    )
  }

  return (

    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">

      {/* HEADER */}
      <div className="space-y-2">

        <h1 className="text-4xl font-bold">

          Course Assessment

        </h1>

        <p className="text-foreground/60">

          Pass score: 70%

        </p>

      </div>

      {/* DEBUG */}
      <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">

        {JSON.stringify(
          questions,
          null,
          2
        )}

      </pre>

      {/* QUESTIONS */}
      {questions.map(
        (question, index) => (

          <div
            key={question.id}
            className="border rounded-xl p-6 space-y-4"
          >

            <h2 className="text-lg font-semibold">

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
                  className={`w-full text-left border rounded-lg p-4 transition-all ${
                    answers[
                      question.id
                    ] === option
                      ? 'border-primary bg-primary/10'
                      : 'hover:bg-muted'
                  }`}
                >

                  {option}

                </button>

              ))}

            </div>

          </div>

        )
      )}

      {/* SUBMIT */}
      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full"
      >

        {submitting
          ? 'Submitting...'
          : 'Submit Assessment'}

      </Button>

    </div>
  )
}