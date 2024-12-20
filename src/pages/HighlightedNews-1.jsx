import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeaturedNews } from '../redux/slicers/FeatheredNewsSlice';
import { Link } from 'react-router-dom';
import './style.css';

function HighLightedNews() {
    const carouselRef = useRef(null);
    const dispatch = useDispatch();
    const { news, loading, error } = useSelector((state) => state.featuredNews);

    const scrollSpeed = 3000; // Speed of the auto-scroll in milliseconds
    const cardWidth = 300; // Approximate card width, including margin

    // Fetch featured news on mount
    useEffect(() => {
        dispatch(fetchFeaturedNews());
    }, [dispatch]);

    useEffect(() => {
        const carousel = carouselRef.current;

        let scrollPosition = 0;
        const autoScroll = setInterval(() => {
            if (carousel) {
                scrollPosition += cardWidth;
                if (scrollPosition >= carousel.scrollWidth / 2) {
                    // Reset to the beginning (duplicated cards make this seamless)
                    carousel.scrollLeft = 0;
                    scrollPosition = cardWidth;
                }
                carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        }, scrollSpeed);

        return () => clearInterval(autoScroll); // Cleanup on component unmount
    }, []);

    const scrollLeft = () => {
        carouselRef.current.scrollBy({
            left: -cardWidth,
            behavior: 'smooth',
        });
    };

    const scrollRight = () => {
        carouselRef.current.scrollBy({
            left: cardWidth,
            behavior: 'smooth',
        });
    };

    // If no data is fetched, show empty cards with heading and description
    const displayNews = news.length > 0 ? news : Array(4).fill({
        name: 'No Data Available',
        description: 'No description available at the moment.',
        id: 1,  // Dummy id for fallback
    });

    return (
        <div className="bg-white py-16 mt-6">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
                {/* Heading */}
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-10">
                    You Should Know
                </h2>

                <div className="relative flex items-center justify-center">
                    {/* Left Arrow */}
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10 hover:bg-gray-700 focus:outline-none"
                    >
                        &#8592;
                    </button>

                    {/* Carousel */}
                    <div
                        ref={carouselRef}
                        className="flex space-x-5 overflow-hidden px-4"
                        style={{
                            scrollSnapType: 'x mandatory',
                        }}
                    >
                        {/* Duplicate cards for seamless scrolling */}
                        {[...displayNews, ...displayNews].map((product, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-72 group relative cursor-pointer items-center justify-center overflow-hidden transition-shadow hover:shadow-xl hover:shadow-black/30"
                                style={{
                                    scrollSnapAlign: 'center',
                                }}
                            >
                                <div className="h-96 w-72 bg-gray-200 flex justify-center items-center">
                                    {/* No image if no data */}
                                    <p className="text-gray-500 text-center">No Image Available</p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-6 text-center transition-all duration-500 group-hover:pb-12">
                                    <h2 className="font-dmserif text-2xl font-bold text-white mb-2">
                                        {product.name}
                                    </h2>
                                    <p className="mb-4 text-sm italic text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        {product.description}
                                    </p>
                                    {/* Link with dynamic routing to the specific news */}
                                    <Link
                                        to={`/news/${product.id}`}  // Updated with dynamic `id`
                                        className="rounded-full bg-neutral-900 py-2 px-3.5 font-com text-sm capitalize text-white shadow shadow-black/60"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10 hover:bg-gray-700 focus:outline-none"
                    >
                        &#8594;
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HighLightedNews;
