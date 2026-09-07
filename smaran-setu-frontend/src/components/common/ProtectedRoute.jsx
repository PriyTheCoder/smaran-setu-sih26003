import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ role }) {
  const { role: currentRole, token } = useAuth()
  const location = useLocation()

  if (!currentRole || !token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (currentRole !== role) {
    return (
      <Navigate
        to={currentRole === 'user' ? '/user/home' : '/caregiver/dashboard'}
        replace
      />
    )
  }

  return <Outlet />
}
