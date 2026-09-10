import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import InitialAssessmentForm from '../../components/patient/InitialAssessment'

export default function InitialAssessment() {
  const navigate = useNavigate()

  const { role, profile, saveProfile } = useAuth()

  const handleComplete = async (assessment) => {
    if (!profile?.userId) {
      alert('Patient ID not found. Please login again.')
      return
    }

    try {
      // ================================
      // REPORT → PYTHON BACKEND
      // ================================
      if (assessment.method === 'report' && assessment.file) {
        const formData = new FormData()
        formData.append('file', assessment.file)

        const response = await fetch(
          `https://smaransetuaibknd.onrender.com/api/patient/${profile.userId}/medical-report`,
          {
            method: 'POST',
            body: formData,
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || data.error || 'Report upload failed')
        }

        console.log('Medical report saved:', data)
      }

      // ================================
      // SAVE FRONTEND PROFILE
      // ================================
      const assessmentData = {
        method: assessment.method,
        symptoms: assessment.symptoms || [],
        fileName: assessment.file?.name || null,
        status: 'completed',
        createdAt: Date.now(),
      }

      const updatedProfile = {
        ...(profile || {}),
        cognitiveAssessment: assessmentData,
      }

      saveProfile(updatedProfile)

      // ================================
      // CONTINUE TO HOME
      // ================================
      if (role === 'user') {
        navigate('/user/home', { replace: true })
      } else {
        navigate('/caregiver/dashboard', { replace: true })
      }

    } catch (error) {
      console.error('Medical report upload error:', error)

      alert(
        error.message ||
        'Unable to upload the medical report. Please try again.'
      )
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
