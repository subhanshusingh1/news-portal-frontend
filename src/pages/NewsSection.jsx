import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchSpecificNews } from "../redux/slicers/FetchSpecificNews";
import { fetchTrendingNews } from "../redux/slicers/FetchTrendingNews";
import { formatDistanceToNow } from "date-fns";

const NewsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route location

  const [loadingMainNewsId, setLoadingMainNewsId] = useState(null);
  const [visibleTrendingNewsCount, setVisibleTrendingNewsCount] = useState(3); // Controls visible trending news count

  // Redux state for main news
  const {
    news: mainNews,
    loading: mainNewsLoading,
    error: mainNewsError,
  } = useSelector((state) => state.specificNews);

  // Redux state for trending news
  const {
    news: trendingNews,
    loading: trendingNewsLoading,
    error: trendingNewsError,
  } = useSelector((state) => state.trendingNews);

  // Fetch main news based on route parameter
  const { newsId: mainNewsId } = useParams();

  console.log(mainNewsId);

  useEffect(() => {
    if (mainNewsId) {
      dispatch(fetchSpecificNews(mainNewsId));
      console.log(fetchSpecificNews(mainNewsId));
    }
  }, [dispatch, mainNewsId]);

  // Fetch trending news on component mount
  useEffect(() => {
    dispatch(fetchTrendingNews());
  }, [dispatch]);

  useEffect(() => {
    // Scroll to the top of the page on initial load of the event page
    window.scrollTo(0, 0);
  }, [location]);

  const handleCardClick = (id) => {
    setLoadingMainNewsId(id);
    setTimeout(() => {
      navigate(`/news/${id}`);
      setLoadingMainNewsId(null);
    }, 2000);
  };

  const handleLoadMoreTrendingNews = () => {
    setVisibleTrendingNewsCount((prevCount) => prevCount + 3);
  };

  return (
    <div className="font-sans py-8 px-4 sm:px-8 lg:px-16 mt-16">
      {/* Main News Loading Overlay */}
      {mainNewsLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 z-50 flex items-center justify-center backdrop-blur-lg">
          <div className="text-white text-lg">Loading...</div>
        </div>
      )}

      {/* Main News Error */}
      {mainNewsError && (
        <div className="text-red-500 text-center mt-4">
          Failed to load the main news:{" "}
          {mainNewsError.message || "Unknown error"}
        </div>
      )}

      {/* Main News Section */}
      {!mainNewsLoading && !mainNewsError && mainNews ? (
        <section className="container mx-auto max-w-screen-lg p-4">
          <h1 className="text-4xl font-bold text-gray-800 leading-tight text-left">
            {mainNews.title || "News Title Not Found"}
          </h1>
          <div className="flex items-center text-left mt-2">
            <p className="text-gray-500">
              <span className="flex items-center">
                <FaUserCircle className="text-gray-600 mr-2" size={16} />
                {mainNews.reporter || "Unknown Reporter"}
              </span>
            </p>
            <p className="text-gray-400 ml-4">
              {mainNews.date
                ? `${formatDistanceToNow(new Date(mainNews.date), {
                    addSuffix: true,
                  })}`
                : "Date Not Available"}
            </p>
          </div>
          <img
            src={mainNews.imageSrc || "https://via.placeholder.com/1200"}
            alt={mainNews.title || "News Image"}
            className="w-full h-96 object-cover rounded-lg mt-4"
          />
          <div className="text-gray-600 mt-4 leading-relaxed text-left px-8 lg:px-16">
            <p className="mb-4">
              {mainNews.description || "Description Not Found"}
            </p>
          </div>
        </section>
      ) : !mainNewsLoading && !mainNewsError ? (
        <section className="container mx-auto max-w-screen-lg p-4">
          <h1 className="text-4xl font-bold text-gray-800 leading-tight text-left">
            No Main News Available
          </h1>

          {/* Fallback Layout - Skeleton Placeholder */}
          <div className="flex flex-col gap-4 mt-6">
            <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse" />
              <div className="w-1/2 h-4 bg-gray-300 rounded animate-pulse" />
            </div>
            <div className="w-full h-72 bg-gray-300 rounded-lg animate-pulse mt-4" />
            <div className="w-full h-4 bg-gray-300 rounded animate-pulse mt-6" />
          </div>
        </section>
      ) : null}

      {/* Trending News Section */}
      <section className="container mx-auto max-w-screen-lg mt-8 p-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-left mb-4">
          Trending News
        </h2>

        {trendingNewsLoading ? (
          <div className="flex flex-col gap-3">
            {/* Skeleton Loader for Trending News */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-row items-start border rounded-lg shadow-sm p-3"
              >
                <div className="w-1/4 h-24 bg-gray-300 rounded-l-lg animate-pulse" />
                <div className="flex flex-col justify-center w-3/4 p-3">
                  <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : trendingNewsError ? (
          <div className="text-red-500 text-center mt-4">
            Failed to load trending news.
          </div>
        ) : trendingNews.length === 0 ? (
          <div className="text-gray-500 text-center mt-4">
            No trending news available at the moment.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {trendingNews.slice(0, visibleTrendingNewsCount).map((news) => (
              <div
                key={news.id}
                className={`flex flex-row items-start border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer ${
                  loadingMainNewsId === news.id ? "opacity-50" : ""
                }`}
                onClick={() => handleCardClick(news.id)}
              >
                <img
                  src={news.imageSrc}
                  alt={news.title}
                  className="w-1/3 sm:w-1/4 h-24 sm:h-32 object-cover rounded-l-lg"
                />
                <div className="flex flex-col justify-center p-3 w-2/3 sm:w-3/4">
                  <span className="inline-block bg-blue-500 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-md mb-2 max-w-max">
                    {news.place}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-gray-800">
                    {news.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                      {news?.description || "No description available."}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{news.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {visibleTrendingNewsCount < trendingNews.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMoreTrendingNews}
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition"
            >
              Load More News
              <span className="text-gray-500">↓</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default NewsSection;
