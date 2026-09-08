import { Navigate, Route, Routes } from 'react-router-dom'
import Welcome from './pages/auth/Welcome'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import BasicDetails from './pages/auth/BasicDetails'
import RoleSelection from './pages/auth/RoleSelection'
import PatientLayout from './layouts/PatientLayout'
import CaregiverLayout from './layouts/CaregiverLayout'
import Home from './pages/patient/Home'
import Games from './pages/patient/Games'
import GamePlay from './pages/patient/GamePlay'
import GameResult from './pages/patient/GameResult'
import Memories from './pages/patient/Memories'
import MemoryDetails from './pages/patient/MemoryDetails'
import Routine from './pages/patient/Routine'
import Progress from './pages/patient/Progress'
import Profile from './pages/patient/Profile'
import Accessibility from './pages/patient/Accessibility'
import CaregiverDashboard from './pages/caregiver/Dashboard'
import UserProfile from './pages/caregiver/UserProfile'
import CaregiverMemories from './pages/caregiver/Memories'
import AddMemory from './pages/caregiver/AddMemory'
import Activities from './pages/caregiver/Activities'
import CaregiverProgress from './pages/caregiver/Progress'
import Alerts from './pages/caregiver/Alerts'
import Reports from './pages/caregiver/Reports'
import Settings from './pages/caregiver/Settings'
import ProtectedRoute from './components/common/ProtectedRoute'
import InitialAssessment from './pages/auth/InitialAssessment'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
     <Route path="/register" element={<Register />} />

<Route path="/setup-profile" element={<BasicDetails />} />

 <Route
  path="/initial-assessment"
  element={<InitialAssessment />}
/>

<Route path="/role-selection" element={<RoleSelection />} />

      <Route element={<ProtectedRoute role="user" />}>
        <Route path="/user" element={<PatientLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="games" element={<Games />} />
          <Route path="games/:gameId" element={<GamePlay />} />
          <Route path="result" element={<GameResult />} />
          <Route path="memories" element={<Memories />} />
          <Route path="memories/:memoryId" element={<MemoryDetails />} />
          <Route path="routine" element={<Routine />} />
          <Route path="progress" element={<Progress />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Accessibility />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="caregiver" />}>
        <Route path="/caregiver" element={<CaregiverLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CaregiverDashboard />} />
          <Route path="user" element={<UserProfile />} />
          <Route path="memories" element={<CaregiverMemories />} />
          <Route path="memories/add" element={<AddMemory />} />
          <Route path="activities" element={<Activities />} />
          <Route path="progress" element={<CaregiverProgress />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
     
    </Routes>
  )
}
