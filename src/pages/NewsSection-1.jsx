import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpecificNews } from "../redux/slicers/FetchSpecificNews"; // Adjust the path

const fallbackImages = [
  "https://via.placeholder.com/600x400/?text=Image+1",
  "https://via.placeholder.com/600x400/?text=Image+2",
  "https://via.placeholder.com/600x400/?text=Image+3",
];

export default function NewsSection() {
  const { newsId } = useParams(); // Get the newsId from the URL params
  const dispatch = useDispatch();
  const { news, loading, error } = useSelector((state) => state.news);

  const carouselRef = useRef(null); // Ref for the carousel
  const [currentIndex, setCurrentIndex] = useState(0); // To track the current image index
  const [imageWidth, setImageWidth] = useState(0); // To track the width of the images

  useEffect(() => {
    dispatch(fetchSpecificNews(newsId)); // Fetch the news data based on newsId
  }, [dispatch, newsId]);

  // Update image width once the images are loaded
  useEffect(() => {
    if (carouselRef.current) {
      setImageWidth(carouselRef.current.offsetWidth); // Set the width of each image
    }
  }, [news]); // Recalculate when news changes

  // Handle scrolling to the right (move to the next image)
  const scrollRight = () => {
    const totalImages = news?.profileImage?.length || fallbackImages.length;
    const nextIndex = (currentIndex + 1) % totalImages; // Go to the next image (wrap around)
    setCurrentIndex(nextIndex);
    carouselRef.current.scrollTo({
      left: imageWidth * nextIndex,
      behavior: "smooth",
    });
  };

  // Handle scrolling to the left (move to the previous image)
  const scrollLeft = () => {
    const totalImages = news?.profileImage?.length || fallbackImages.length;
    const prevIndex =
      (currentIndex - 1 + totalImages) % totalImages; // Go to the previous image (wrap around)
    setCurrentIndex(prevIndex);
    carouselRef.current.scrollTo({
      left: imageWidth * prevIndex,
      behavior: "smooth",
    });
  };

  if (loading) return <div>Loading...</div>; // Display a loading message or spinner while loading
  if (error) return <div>Error: {error}</div>; // Handle errors, if any

  const images = news?.profileImage || fallbackImages;

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between p-4">
          <div className="text-center lg:text-left lg:w-1/2 mb-4 lg:mb-0">
            <h2 className="text-base/7 font-semibold text-indigo-600">
              {news?.reporterId?.name || "Reporter Name"}
            </h2>
            <p className="mt-4 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {news?.title || "Dummy News Heading"}
            </p>
          </div>

          <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
            {/* Carousel for News Images */}
            <div className="relative flex items-center">
              {/* Left Arrow */}
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10 hover:bg-gray-700 focus:outline-none"
              >
                &#8592;
              </button>

              <div
                ref={carouselRef}
                className="flex overflow-hidden space-x-5 px-4"
                style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
              >
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-full sm:w-80 md:w-96 lg:w-[600px] h-[350px] md:h-[600px] lg:h-[600px] bg-gray-200"
                      style={{
                        scrollSnapAlign: "center",
                      }}
                    >
                      <img
                        alt={`News Image ${index + 1}`}
                        src={image}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex-shrink-0 w-full sm:w-80 md:w-96 lg:w-[600px] h-[350px] md:h-[600px] lg:h-[600px] bg-gray-200">
                    <img
                      alt="Placeholder"
                      src="https://via.placeholder.com/150"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                )}
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
      </div>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="mt-6 text-lg/8 text-gray-600 text-left">
              {news?.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
