import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedNews } from "../redux/slicers/FeatheredNewsSlice"; // Adjust the import path

const HighlightedNews = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the news data and loading state from the Redux store
  const { news, loading, error } = useSelector((state) => state.featuredNews);

  const [sliceStart, setSliceStart] = useState(0);
  const [displayedNews, setDisplayedNews] = useState([]);
  const itemsPerSlice = 2; // Define how many items to load per slice

  useEffect(() => {
    // Dispatch the action to fetch featured news when the component mounts
    dispatch(fetchFeaturedNews());
  }, [dispatch]);

  useEffect(() => {
    // Update displayed news when the `news` array is loaded
    setDisplayedNews(news.slice(0, sliceStart + itemsPerSlice));
  }, [news, sliceStart]);

  // Fallback content when no data is available
  const renderFallbackContent = () => (
    <>
      <div className="cursor-pointer" onClick={() => handleNewsClick(1)}>
        <img
          src="https://via.placeholder.com/600x300.png?text=Breaking+News"
          alt="Main News"
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">No Title Available</h2>
          <p className="text-sm text-gray-700 mb-2">
            No description available.
          </p>
          <p className="text-xs text-gray-500">Unknown Author</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="flex flex-row overflow-hidden cursor-pointer mb-4"
            onClick={() => handleNewsClick(index + 2)} // Provide a fallback ID for the news items
          >
            <img
              src="https://via.placeholder.com/300x200.png?text=Loading"
              alt={`News ${index + 1}`}
              className="w-1/3 object-cover rounded-lg"
            />
            <div className="p-2 w-2/3">
              <h3 className="text-sm sm:text-base font-bold mb-1">
                No Title Available
              </h3>
              <p className="text-xs text-gray-500">No description available.</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // Handle news click
  const handleNewsClick = (newsId) => {
    document.body.classList.add("blur");
    setTimeout(() => {
      document.body.classList.remove("blur");
      navigate(`/news/${newsId}`);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-6 pt-16 max-w-screen-lg mt-16">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left inline-block bg-red-600 text-white py-1 px-3 rounded-full">
        Trending News
      </h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {loading || !news.length ? (
          renderFallbackContent()
        ) : (
          <>
            {/* Left Section */}
            <div
              className="cursor-pointer"
              onClick={() => handleNewsClick(displayedNews[0]?.id)} // Safe access with optional chaining
            >
              <img
                src={displayedNews[0]?.imageSrc || "https://via.placeholder.com/600x300.png?text=No+Image"} // Fallback for missing image
                alt="Main News"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">
                  {displayedNews[0]?.title || "No Title Available"}
                </h2>
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                  {displayedNews[0]?.description || "No description available."}
                </p>
                <p className="text-xs text-gray-500">
                  Reporter: {displayedNews[0]?.reporter || "Unknown Reporter"}
                </p>
              </div>
            </div>

            {/* Right Section (News Cards) */}
            <div className="grid grid-cols-1 gap-4">
              {displayedNews.map((newsItem) => (
                <div
                  key={newsItem?.id} // Safe access with optional chaining
                  className="flex flex-row overflow-hidden cursor-pointer mb-4"
                  onClick={() => handleNewsClick(newsItem?.id)} // Safe access with optional chaining
                >
                  <img
                    src={newsItem?.imageSrc || "https://via.placeholder.com/300x200.png?text=No+Image"} // Fallback for missing image
                    alt={newsItem?.title || "No Title"}
                    className="w-1/3 object-cover rounded-lg"
                  />
                  <div className="p-2 w-2/3">
                    <h3 className="text-sm sm:text-base font-bold mb-1">
                      {newsItem?.title || "No Title Available"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Reporter: {newsItem?.reporter || "Unknown Reporter"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination/Next Slice Button */}
      {news.length > displayedNews.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setSliceStart(sliceStart + itemsPerSlice)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default HighlightedNews;
