import Slider from "react-slick";
import { useEffect, useRef, useState } from "react";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import { Link } from 'react-router-dom';

const NewArrivalSlick = ({
    newArrivals,
    imgHeight = '450px',
    headTitle,
    subTitle
}) => {
    const sliderRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0)
    const [slidesToShow, setSlidesToShow] = useState(3)

    const updateSlidesToShow = () => {
        const width = window.innerWidth;
        if (width < 575) setSlidesToShow(1)
        else if (width < 768) setSlidesToShow(2)
        else setSlidesToShow(3)
    }

    useEffect(() => {
        updateSlidesToShow()
        window.addEventListener('resize', updateSlidesToShow)
        return () => window.removeEventListener('resize', updateSlidesToShow)
    } ,[])

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow,
        slidesToScroll: 1,
        arrows: false,
        beforeChange: (oldIdx, newIdx) => {
            setCurrentSlide(newIdx)
        },
        responsive: [
            {
                breakpoint: 1024, // tablets
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768, // Mini-Tablet
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 575, // Mobile
                settings: {
                    slidesToShow: 1,
                },
            }
        ],
    };

    const disablePrev = currentSlide === 0;
    const disableNext = currentSlide >= newArrivals.length - slidesToShow

    return (
        <section className="container mx-auto mb-10 relative">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">{headTitle}</h2>
                <p className="text-lg text-start xs:text-center text-gray-600">
                    {subTitle}
                </p>
            </div>

            {/* Controls */}
            <div className="absolute right-0 top-18 sm:top-0 md:top-10 lg:top-0 flex space-x-2 z-10">
                <button
                    onClick={() => sliderRef.current?.slickPrev()}
                    className="btn bg-white border-0 text-[18px] text-main-theme"
                    disabled={disablePrev}
                >
                    <MdArrowBackIos />
                </button>
                <button
                    onClick={() => sliderRef.current?.slickNext()}
                    className="btn bg-white border-0 text-[18px] text-main-theme"
                    disabled={disableNext}
                >
                    <MdArrowForwardIos />
                </button>
            </div>

            {/* Slider */}
            <Slider ref={sliderRef} {...settings}>
                {newArrivals.map((products) => (
                    <div key={products?._id} className="px-2">
                        <div className="relative rounded-lg overflow-hidden">
                            <img
                                src={products?.images[0]?.url}
                                alt={products?.images[0]?.altText || products?.name}
                                style={{ height: imgHeight }}
                                className="w-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md text-white p-4">
                                <Link to={`/product/${products?._id}`} className="block">
                                    <h4 className="font-medium">{products?.name}</h4>
                                    <p className="mt-1">₹{products?.price}</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default NewArrivalSlick;
