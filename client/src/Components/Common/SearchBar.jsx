import { useState } from "react"
import { BsSearch } from "react-icons/bs"
import { FaXmark } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { fetchProductByFilters, setFilters } from "../../Redux/Slice/ProductSlice";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const [searchItem, setSearchItem] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleOpen = () => {
        setIsOpen(!isOpen)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(setFilters({ search: searchItem }))
        dispatch(fetchProductByFilters({ search: searchItem }))
        navigate(`collections/all?search=${searchItem}`)
        setIsOpen(!isOpen)
    }
    return (
        <div className={`
        flex items-center justify-center w-full transition-all duration-300 
        ${isOpen ? 'absolute top-0 left-0 w-full bg-white h-full z-50' : 'w-auto'}
        `}>
            {isOpen ? (
                <form onSubmit={handleSubmit} className="relative flex items-center justify-center gap-2 w-full">
                    <div className="relative w-4/5 md:w-1/2">
                        <input
                            type="text"
                            className="input bg-neutral-200 focus:outline-main-theme w-full"
                            placeholder="Search"
                            value={searchItem}
                            onChange={(e) => setSearchItem(e.target.value)}
                        />
                        <button type="submit" className="absolute right-0 top-1/2 transform -translate-1/2 z-1">
                            <BsSearch className="w-5 h-5 text-gray-500 cursor-pointer" />
                        </button>
                    </div>
                    {/* Close Button */}
                    <button
                        type="button"
                        className="btn bg-main-theme border-0 outline-0"
                        onClick={handleOpen}
                    >
                        <FaXmark className="w-5 h-5 text-white cursor-pointer" />
                    </button>
                </form>
            ) : (
                <div className="" onClick={handleOpen}>
                    <BsSearch className="w-5 h-5 text-gray-500 cursor-pointer" />
                </div>
            )}
        </div>
    )
}

export default SearchBar