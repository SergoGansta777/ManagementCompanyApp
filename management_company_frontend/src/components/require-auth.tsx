import { useAuth } from '@/context/authContext'
import { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

const RequireAuth = ({ children }: PropsWithChildren) => {
  const { token } = useAuth()
  
  if (!token) {
    return <Navigate to='/login' replace />
  }
  
  return children
}

export default RequireAuth
