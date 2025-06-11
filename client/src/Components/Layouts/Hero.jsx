import { Link } from 'react-router-dom'
import HeroImg from '../../Assets/hero_img.jpg'

const Hero = () => {
  return (
    <section className='relative'>
        <img className="w-full h-[300px] md:h-[500px] lg:h-[650px] object-cover" src={HeroImg} />
        <div className="flex items-center justify-center absolute inset-0 bg-black/50">
            <div className="text-center text-white p-6">
                <h1 className="text-4xl md:text-7xl lg:text-9xl font-bold tracking-tighter uppercase mb-4">
                    Styled <br /> Reimagined
                </h1>
                <p className="text-md md:text-lg mb-6">
                    Unleash confidence with every stitch — fashion that speaks before you do.
                </p>
                <button type='button' className="btn bg-main-theme border-0">
                    <Link to='/' className=''>Shop Now</Link>
                </button>
            </div>
        </div>
    </section>
  )
}

export default Hero