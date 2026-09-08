import { useState } from 'react'
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'

import { cognitiveSymptoms } from '../../data/cognitiveSymptoms'

export default function InitialAssessment({ onComplete }) {
  const [method, setMethod] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  const toggleSymptom = (id) => {
    setSelectedSymptoms((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) return

    setError('')

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, JPG, PNG or WEBP file.')
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Please upload a file smaller than 5 MB.')
      return
    }

    setFile(selectedFile)
  }

  const handleContinue = () => {
    setError('')

    if (!method) {
      setError('Please choose how you want to complete the assessment.')
      return
    }

    if (method === 'report' && !file) {
      setError('Please upload a medical or health report.')
      return
    }

    if (method === 'symptoms' && selectedSymptoms.length === 0) {
      setError('Please select at least one symptom.')
      return
    }

    if (onComplete) {
      onComplete({
        method,
        file,
        symptoms: selectedSymptoms,
      })
    }
  }

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-3xl">
          🧠
        </div>

        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Initial Cognitive Assessment
        </h1>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
          Help us understand the patient's needs so Smaran Setu can
          suggest a comfortable starting level for cognitive activities.
        </p>
      </div>

      {/* Privacy / info box */}
      <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
        <div className="flex gap-3">
          <span className="text-xl">🔒</span>

          <div>
            <p className="font-semibold text-teal-900">
              Your information is used for activity guidance
            </p>

            <p className="mt-1 text-sm leading-5 text-teal-800">
              This assessment is intended to help choose an initial
              cognitive activity difficulty. It is not a medical diagnosis.
            </p>
          </div>
        </div>
      </div>

      {/* Choose method */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          How would you like to continue?
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">

          {/* Report */}
          <button
            type="button"
            onClick={() => {
              setMethod('report')
              setError('')
            }}
            className={`rounded-2xl border-2 p-5 text-left transition-all ${
              method === 'report'
                ? 'border-teal-600 bg-teal-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-sm'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <FileText
                  size={25}
                  className="text-blue-700"
                />
              </div>

              {method === 'report' && (
                <CheckCircle2
                  size={22}
                  className="text-teal-700"
                />
              )}
            </div>

            <h3 className="font-bold text-slate-900">
              I have a report
            </h3>

            <p className="mt-2 text-sm leading-5 text-slate-600">
              Upload a recent medical or health-related report for
              analysis.
            </p>
          </button>

          {/* Symptoms */}
          <button
            type="button"
            onClick={() => {
              setMethod('symptoms')
              setError('')
            }}
            className={`rounded-2xl border-2 p-5 text-left transition-all ${
              method === 'symptoms'
                ? 'border-teal-600 bg-teal-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-sm'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                <span className="text-2xl">✓</span>
              </div>

              {method === 'symptoms' && (
                <CheckCircle2
                  size={22}
                  className="text-teal-700"
                />
              )}
            </div>

            <h3 className="font-bold text-slate-900">
              I don't have a report
            </h3>

            <p className="mt-2 text-sm leading-5 text-slate-600">
              Select the difficulties the patient is currently
              experiencing.
            </p>
          </button>
        </div>
      </div>

      {/* Report section */}
      {method === 'report' && (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">

          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
              <Upload
                size={25}
                className="text-teal-700"
              />
            </div>

            <h3 className="font-bold text-slate-900">
              Upload Medical / Health Report
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              PDF, JPG, PNG or WEBP · Maximum 5 MB
            </p>

            <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800">
              <Upload size={18} />
              Choose File

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {file && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
              <FileText
                size={22}
                className="text-green-700"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-green-900">
                  {file.name}
                </p>

                <p className="text-xs text-green-700">
                  File selected successfully
                </p>
              </div>

              <CheckCircle2
                size={21}
                className="text-green-700"
              />
            </div>
          )}
        </div>
      )}

      {/* Symptoms section */}
      {method === 'symptoms' && (
        <div>
          <div className="mb-4">
            <h2 className="font-bold text-slate-900">
              What difficulties does the patient experience?
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              You can select more than one.
            </p>
          </div>

          <div className="space-y-3">
            {cognitiveSymptoms.map((symptom) => {
              const selected = selectedSymptoms.includes(symptom.id)

              return (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                    selected
                      ? 'border-teal-600 bg-teal-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-teal-300'
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-2xl">
                    {symptom.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">
                      {symptom.title}
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      {symptom.description}
                    </p>
                  </div>

                  <div
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      selected
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {selected && (
                      <span className="text-xs font-bold">✓</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {/* Continue */}
      <button
        type="button"
        onClick={handleContinue}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-4 font-bold text-white shadow-sm transition hover:bg-teal-800"
      >
        Analyze & Continue
        <ArrowRight size={19} />
      </button>

      {/* Skip */}
      <p className="text-center text-xs leading-5 text-slate-500">
        Don't have a report? That's okay. You can use the symptom
        selection instead.
      </p>
    </div>
  )
}