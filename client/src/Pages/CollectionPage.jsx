import React, { useEffect, useRef, useState } from 'react'
import { CiFilter } from "react-icons/ci";
import FilterSidebar from '../Components/Products/FilterSidebar';
import SortOption from '../Components/Products/SortOption';
import ProductGrid from '../Components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductByFilters } from '../Redux/Slice/ProductSlice';



const CollectionPage = () => {
    const { collections } = useParams()
    const [ searchParams ] = useSearchParams()
    const dispatch = useDispatch()
    const { products, loading, error } = useSelector(state => state.products)
    const queryParams = Object.fromEntries([...searchParams])

    useEffect(() => {
        dispatch(fetchProductByFilters({ collections, ...queryParams }))
    }, [dispatch, collections, searchParams])


    const sidebarRef = useRef(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setIsSidebarOpen(!sidebarRef)
            }
        }
        // Add event listener
        document.addEventListener('mousedown', handleClickOutside)
        // Remove eventlistener
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    return (
        <div className='flex flex-col lg:flex-row relative'>
            {/* Mobile filter button */}
            <button
                onClick={toggleSidebar}
                className='btn lg:hidden flex justify-center items-center bg-transparent border-0 text-black shadow-none'>
                <CiFilter /> Filter
            </button>

            {/* Filter Sidebar */}
            <div ref={sidebarRef} className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-0 z-50 w-64 bg-white transition-transform overflow-y-auto duration-300 lg:static lg:translate-x-0`}>
                <FilterSidebar />
            </div>

            {/* All Collection */}
            <div className="flex-grow p-4">
                <h2 className="text-2xl font-medium mb-4">ALL COLLECTION</h2>


                {/* Sort Options */}
                <SortOption />

                {/* Products */}
                <ProductGrid Products={products} loading={loading} error={error} />
            </div>
        </div>
    )
}

export default CollectionPage