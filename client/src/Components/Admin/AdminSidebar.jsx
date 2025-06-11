import { FaBoxOpen, FaClipboardList, FaStore, FaUser } from "react-icons/fa6"
import { useDispatch } from "react-redux"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { logout } from "../../Redux/Slice/authSlice"
import { clearCart } from "../../Redux/Slice/cartSlice"
import { IoIosAddCircleOutline } from "react-icons/io";
const adminPanel = [
    { label: "Users", Icon: <FaUser />, link: 'users' },
    { label: "Products", Icon: <FaBoxOpen />, link: 'products' },
    { label: "Add Products", Icon: <IoIosAddCircleOutline />, link: 'add-product' },
    { label: "Orders", Icon: <FaClipboardList />, link: 'orders' },
    { label: "Shop", Icon: <FaStore />, link: '/' },
]

const AdminSidebar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = () => {
        dispatch(logout())
        dispatch(clearCart())
        navigate('/')
    }
    return (
        <div className="p-6">
            <div className="mb-6">
                <Link to='/' className="text-2xl font-bold small-caps">VelvetClaw</Link>
            </div>
            <h2 onClick={() => navigate('/admin')} className="text-xl font-medium mb-6 text-center cursor-pointer">Admin Dashboard</h2>

            <nav className="flex flex-col space-y-2">
                {adminPanel?.map(({ label, Icon, link }, idx) => (
                    <NavLink key={idx} to={link} className={({ isActive }) =>
                        isActive
                            ? "bg-white text-main-theme rounded flex items-center space-x-2 py-3 px-4"
                            : "flex items-center space-x-2 text-white hover:bg-white hover:text-main-theme rounded p-2"
                    }>
                        {Icon}
                        <span className="">{label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="mt-6">
                <button className="btn btn-wide bg-main-theme border-0" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

export default AdminSidebar