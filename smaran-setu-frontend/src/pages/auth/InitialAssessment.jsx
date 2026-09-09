import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import InitialAssessmentForm from '../../components/patient/InitialAssessment'

export default function InitialAssessment() {
  const navigate = useNavigate()

  const { role, profile, saveProfile } = useAuth()

  const handleComplete = (assessment) => {
    // PHASE 1:
    // We are only saving the selected information.
    // Gemini analysis will be added in Phase 2.

    const assessmentData = {
      method: assessment.method,
      symptoms: assessment.symptoms || [],
      fileName: assessment.file?.name || null,
      status: 'pending-analysis',
      createdAt: Date.now(),
    }

    const updatedProfile = {
      ...(profile || {}),
      cognitiveAssessment: assessmentData,
    }

    saveProfile(updatedProfile)

    if (role === 'user') {
      navigate('/user/home', { replace: true })
    } else {
      navigate('/caregiver/dashboard', { replace: true })
    }
  }

  if (!role) {
    navigate('/login', { replace: true })
    return null
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        <div className="mb-6 text-center">
          <p className="text-sm font-semibold text-teal-700">
            Step 2 of 2
          </p>
        </div>

        <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-8">
          <InitialAssessmentForm
            onComplete={handleComplete}
          />
        </section>

      </div>
    </main>
  )
}