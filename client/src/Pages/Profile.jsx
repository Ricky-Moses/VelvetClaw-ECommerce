import { useNavigate } from "react-router-dom"
import MyOrderPage from "./MyOrderPage"
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from "react"
import { logout } from "../Redux/Slice/authSlice"
import { clearCart } from "../Redux/Slice/cartSlice"

const Profile = () => {
    const {user} = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if(!user){
            navigate("/login")
        }
    }, [user, navigate])

    const handleLogout = () => {
        dispatch(logout())
        dispatch(clearCart())
        navigate('/login')
    }
  return (
    <section className="min-h-screen flex flex-col">
        <div className="container flex-grow mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0">
                {/* Left Section */}
                <div className="w-full md:w-1/3 lg:w-1/4 max-h-50 shadow-md rounded-lg p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{user?.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{user?.email}</p>
                <button 
                onClick={handleLogout}
                type="button" className="btn w-full border-0 bg-main-theme">
                    Logout
                </button>
                </div>
                {/* Right section */}
                <div className="w-full md:w-2/3 lg:w-3/4">
                    <MyOrderPage />
                </div>
            </div>
        </div>
    </section>
  )
}

export default Profile