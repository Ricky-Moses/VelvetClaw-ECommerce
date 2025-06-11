import { useState } from "react"
import { FaBars } from "react-icons/fa6"
import AdminSidebar from "./AdminSidebar"
import { Outlet } from "react-router-dom"

const AdminLayout = () => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false)

    const toggleSideBar = () => {
        setIsSideBarOpen(!isSideBarOpen)
    }
    return (
        <div className="min-h-screen flex flex-col md:flex-row relative">
            {/* Mobile Toggle Button */}
            <div className="flex items-center md:hidden bg-main-theme/70 text-white z-20 p-4">
                <button
                    onClick={toggleSideBar}
                    className="btn bg-transparent border-0">
                    <FaBars size={20} />
                </button>
                <h1  className="font-medium text-xl ml-4 ">Admin Dashboard</h1>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSideBarOpen && (
                <div
                    className="fixed inset-0 z-10 bg-black/50 md:hidden"
                    onClick={toggleSideBar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`bg-main-theme/90 w-64 min-h-screen text-white absolute md:relative transform ${isSideBarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}>
                {/* Sidebar */}
                <AdminSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-grow overflow-auto p-6">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout