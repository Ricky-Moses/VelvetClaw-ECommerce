import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const ProtectRoute = ({ children, role }) => {
  const { user } = useSelector(state => state.auth)

  // Check if user is not logged in OR doesn't match the required role (if role is passed)
  if (!user || (role && user.role !== role)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectRoute
