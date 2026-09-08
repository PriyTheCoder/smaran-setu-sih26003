import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

function readProfile(role) {
  if (!role) return null
  try {
    return JSON.parse(
      localStorage.getItem(`smaran_profile_${role}`) || 'null'
    )
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('smaran_role')
  })

  const [profile, setProfile] = useState(() => {
    const savedRole = localStorage.getItem('smaran_role')
    return readProfile(savedRole)
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('smaran_token')
  })

  useEffect(() => {
    if (role) {
      localStorage.setItem('smaran_role', role)
    } else {
      localStorage.removeItem('smaran_role')
    }
  }, [role])

  useEffect(() => {
    if (token) {
      localStorage.setItem('smaran_token', token)
    } else {
      localStorage.removeItem('smaran_token')
    }
  }, [token])

  const signup = async (selectedRole, email, password) => {
   const response = await fetch('https://smaransetu-backend-sih26003.onrender.com/api/auth/signup',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        role: selectedRole.toUpperCase(),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed')
    }

    setRole(selectedRole)
    setProfile({
      userId: data.id,
      email: data.email,
      profileCompleted: data.profileCompleted,
    })

    return data
  }

  const login = async (selectedRole, email, password) => {
   const response = await fetch('https://smaransetu-backend-sih26003.onrender.com/api/auth/login',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        role: selectedRole.toUpperCase(),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    setToken(data.token)
    setRole(selectedRole)
    setProfile({
      userId: data.id,
      email: data.email,
      profileCompleted: data.profileCompleted,
    })

    return data
  }

  const saveProfile = (profileData) => {
    if (!role) return
    localStorage.setItem(
      `smaran_profile_${role}`,
      JSON.stringify(profileData)
    )
    setProfile(profileData)
  }

  const getProfile = (selectedRole) => {
    return readProfile(selectedRole)
  }

  const logout = () => {
    setRole(null)
    setProfile(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        role,
        profile,
        token,
        login,
        logout,
        saveProfile,
        getProfile,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
