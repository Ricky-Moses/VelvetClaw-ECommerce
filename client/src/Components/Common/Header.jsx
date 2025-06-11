import TopBar from '../Layouts/TopBar'
import NavBar from './NavBar'

const Header = () => {
    return (
        <header className='border-b border-gray-200 overflow-x-hidden'>
            {/* TopBar */}
            <TopBar />
            {/* NavBar */}
            <NavBar />
            {/* Cart Drawer */}
        </header>
    )
}

export default Header