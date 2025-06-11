import { Link } from 'react-router-dom'
import MenCollection from '../../Assets/men_collection.jpg'
import WomenCollection from '../../Assets/women_collection.jpg'

const GenderCollection = () => {
  return (
    <section className='py-16 px-4 lg:px-0 grid place-items-center'>
        <div className="container flex flex-col lg:flex-row gap-8">
            {/* Women collection */}
            <div className="relative flex-1">
                <img 
                className="w-full h-[400px] sm:h-[600px] md:h-[700px] object-cover object-top" 
                src={WomenCollection}  alt="Women's Collection"/>
                <div className="absolute bottom-8 left-8 bg-white/90 p-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Women's Collection</h1>
                    <Link to='/collections/all?gender=Women'>Shop Now</Link>
                </div>
            </div>
            {/* Men Collections */}
            <div className="relative flex-1">
                <img 
                className="w-full h-[400px] sm:h-[600px] md:h-[700px] object-cover " 
                src={MenCollection} alt="Men's Collection" />
                <div className="absolute bottom-8 left-8 bg-white/90 p-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Men's Collection</h1>
                    <Link to='/collections/all?gender=Men'>Shop Now</Link>
                </div>
            </div>
        </div>
    </section>
  )
}

export default GenderCollection