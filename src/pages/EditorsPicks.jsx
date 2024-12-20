import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchNewsForSubscribedRegions } from "../redux/slicers/EditorsPicNewsSlice";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { FaAngleDown, FaSpinner } from "react-icons/fa"; // Icons for arrow and spinner

export default function EditorsPicks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useAuth(); // Get the userId from Clerk

  const [showMore, setShowMore] = useState(false); // State to control "See More"
  const [localLoading, setLocalLoading] = useState(true); // Local loading state for 1-second delay
  const [loadingTimeout, setLoadingTimeout] = useState(false); // State to track timeout

  // Redux state
  const { news, loading, error } = useSelector((state) => state.editorPicNews); // Access news state from the editorPicNewsSlice

  // Fetch news for subscribed regions when the component mounts or when subscription changes
  useEffect(() => {
    if (!userId) {
      // If the user is not logged in, stop loading and return early
      setLocalLoading(false);
      setLoadingTimeout(true); // Optionally show a timeout message
      return;
    }

    setLocalLoading(true); // Start loading state
    setLoadingTimeout(false); // Reset timeout flag

    dispatch(fetchNewsForSubscribedRegions(userId));

    const timeoutId = setTimeout(() => {
      setLocalLoading(false); // End loading state after 3 seconds
      setLoadingTimeout(true); // Set timeout flag
    }, 3000);

    return () => clearTimeout(timeoutId); // Clean up timeout on unmount or userId change
  }, [userId, dispatch]);

  // Control the number of news to show
  const displayedNews = showMore ? news : news.slice(0, 3);

  return (
    <div className="bg-white min-h-screen py-8 mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading as Tag */}
        <h2 className="text-2xl font-bold text-white bg-indigo-600 inline-block px-4 py-1 rounded-full mb-8">
          Editors Picks
        </h2>

        {/* Loading Spinner or Main Content */}
        {localLoading || loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            {loadingTimeout ? (
              <div className="text-gray-600">Loading took too long...</div>
            ) : (
              <FaSpinner className="text-indigo-600 text-4xl animate-spin" />
            )}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 rounded-lg shadow-md text-center py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No News Available
            </h2>
            <p className="text-gray-600 max-w-lg px-4">
              Please subscribe to get the latest news for your region.
            </p>
          </div>
        ) : (
          <>
            {/* Main Content */}
            {displayedNews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {displayedNews.map((article) => (
                  <div
                    key={article.id}
                    className="flex flex-row items-start space-x-4 px-4 py-4 border-b border-gray-200 cursor-pointer"
                    onClick={() => navigate(`/news/${article.id}`)}
                  >
                    {/* Image Section */}
                    <img
                      src={article.imageSrc}
                      alt={article.title}
                      className="w-32 h-20 object-cover flex-shrink-0"
                    />

                    {/* Text Section */}
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-800 leading-snug">
                        {article.title}
                      </h3>
                      {/* Description is hidden on smaller screens */}
                      <p className="hidden sm:block text-sm text-gray-600 mt-2 line-clamp-2">
                        {article.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 rounded-lg shadow-md text-center py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  No News Available
                </h2>
                <p className="text-gray-600 max-w-lg px-4">
                  Please subscribe to get the latest news for your region.
                </p>
              </div>
            )}

            {/* See More Button */}
            {news.length > 3 && !showMore && (
              <div className="mt-6 text-center">
                <button
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
                  onClick={() => setShowMore(true)}
                >
                  See More
                  <FaAngleDown className="ml-2" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
