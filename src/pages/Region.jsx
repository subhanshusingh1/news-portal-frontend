import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrendingNews } from "../redux/slicers/FetchTrendingNews";
import {
  fetchNewsByRegion,
  clearNews,
} from "../redux/slicers/SubscribedNewsSlice";
import { fetchDescription } from "../redux/slicers/DescriptionSlice";
import {
  checkSubscriptionStatus,
  subscribeToRegion,
  unsubscribeFromRegion,
} from "../redux/slicers/SubscriptionSlice";
import { useUser } from "@clerk/clerk-react";
import { FaUserCircle } from "react-icons/fa";

const Region = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newsLimit, setNewsLimit] = useState(2);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, regionType } = useParams();

  const { user } = useUser();
  const clerkUserId = user ? user.id : null;

  const { data: description, status: descriptionStatus } = useSelector(
    (state) => state.description
  );
  const { news: trendingNews, loading: trendingLoading } = useSelector(
    (state) => state.trendingNews
  );
  const { news: regionNews, loading: regionNewsLoading } = useSelector(
    (state) => state.subscribedNews
  );
  const { subscribed, subscribeStatus, unsubscribeStatus, message } =
    useSelector((state) => state.subscription);

  const regionNewsArray = Array.isArray(regionNews) ? regionNews : [];

  useEffect(() => {
    dispatch(fetchDescription({ id, regionType }));
    if (clerkUserId) {
      dispatch(
        checkSubscriptionStatus({ clerkUserId, regionId: id, regionType })
      );
    }
  }, [dispatch, id, regionType, clerkUserId]);

  useEffect(() => {
    if (subscribed) {
      dispatch(fetchTrendingNews());
      dispatch(fetchNewsByRegion({ id }));
    }
  }, [subscribed, id, dispatch]);

  useEffect(() => {
    setNewsLimit(subscribed ? 5 : 2);
  }, [subscribed]);

  const handleSubscribeClick = async () => {
    if (!clerkUserId) {
      alert("Please log in to subscribe.");
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(
        subscribeToRegion({ clerkUserId, regionId: id, regionType })
      ).unwrap();
      await dispatch(
        checkSubscriptionStatus({ clerkUserId, regionId: id, regionType })
      ).unwrap();
      alert("Subscription successful!");
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to subscribe. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribeClick = async () => {
    if (!clerkUserId) {
      alert("Please log in to unsubscribe.");
      return;
    }

    try {
      // Immediately set the unsubscribed state
      setIsUnsubscribed(true);

      // Optimistically clear news from UI
      dispatch(clearNews());

      // Proceed with unsubscription
      await dispatch(
        unsubscribeFromRegion({ clerkUserId, regionId: id, regionType })
      ).unwrap();

      // Update subscription status to ensure the backend reflects the change
      await dispatch(
        checkSubscriptionStatus({ clerkUserId, regionId: id, regionType })
      ).unwrap();

      alert("Unsubscribed successfully.");
    } catch (error) {
      console.error("Unsubscription error:", error);
      setIsUnsubscribed(false); // Rollback on error
      alert("Failed to unsubscribe. Please try again later.");
    }
  };

  const handleLoadMoreNews = () => {
    setNewsLimit(newsLimit + 2);
  };

  const handleClick = () => {
    navigate("/sign-up");
  };

  return (
    <div className={`min-h-screen pt-12 mb-10 ${isLoading ? "blur-sm" : ""}`}>
      <div className="w-full bg-white text-gray-800 py-8 px-8 lg:px-24 flex flex-col lg:flex-row justify-between items-center">
        <div className="flex flex-col space-y-6 max-w-lg">
          <h1 className="text-4xl font-extrabold leading-tight text-center lg:text-left">
            {descriptionStatus === "succeeded"
              ? description?.data.name
              : "Loading Region..."}
          </h1>
          <p className="text-sm text-gray-700 max-w-md">
            {descriptionStatus === "succeeded"
              ? description?.data.description
              : "Loading description..."}
          </p>
          {!subscribed ? (
            <button
              onClick={handleSubscribeClick}
              disabled={subscribeStatus === "loading"}
              className={`${
                subscribeStatus === "loading"
                  ? "bg-gray-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white px-6 py-3 rounded-full shadow-lg transition`}
            >
              {subscribeStatus === "loading"
                ? "Subscribing..."
                : "Subscribe for Latest News"}
            </button>
          ) : (
            <>
              <p className="text-sm font-semibold text-green-600">
                {message || "You are subscribed to updates from this region."}
              </p>
              <button
                onClick={handleUnsubscribeClick}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg transition"
              >
                {unsubscribeStatus === "loading"
                  ? "Unsubscribing..."
                  : "Unsubscribe"}
              </button>
            </>
          )}

          {/* Reporter Assigned Section */}
          <div className="mt-6 flex items-center py-4 space-x-3">
            <FaUserCircle className="text-gray-600 text-3xl" />
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Reporter Assigned
              </h3>
              {regionNewsArray?.[0]?.reporter ? (
                <p className="text-lg font-semibold text-gray-800">
                  {regionNewsArray[0].reporter}
                </p>
              ) : (
                <p className="text-lg font-medium text-gray-500">
                  Not Assigned
                </p>
              )}
            </div>
          </div>

          {/* Button to Create News Page */}
          <div className="mt-4 text-center">
            <Link
              to={{
                pathname: "/create-news",
                search: `?regionId=${id}&regionType=${regionType}&reporterId=${clerkUserId}`,
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 shadow-lg transition"
            >
              Create News
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16">
        <div className="flex lg:flex-nowrap flex-wrap justify-center lg:space-x-6 space-x-0 overflow-x-auto">
          <main className="w-full lg:w-2/3 mb-6 lg:mb-0 px-4 mt-4">
            {subscribed && (
              <section className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Latest Region News
                </h2>
                {regionNewsLoading ? (
                  <p>Loading region news...</p>
                ) : regionNewsArray?.length > 0 ? (
                  regionNewsArray.slice(0, newsLimit).map((news) => (
                    <div key={news.id} className="mb-4">
                      <Link
                        to={`/news/${news.id}`}
                        className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                      >
                        <img
                          src={news.imageSrc}
                          alt="News"
                          className="w-full sm:w-40 h-24 sm:h-32 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {news.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {news.description}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p>No news available for this region.</p>
                )}

                {regionNewsArray?.length > newsLimit && (
                  <button
                    onClick={handleLoadMoreNews}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md mx-auto block"
                  >
                    Load More News
                  </button>
                )}
              </section>
            )}
          </main>

          <aside className="w-full lg:w-1/3 px-4 mt-4">
            {subscribed && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Trending News</h2>
                {trendingLoading ? (
                  <p>Loading trending news...</p>
                ) : trendingNews?.length > 0 ? (
                  trendingNews.slice(0, 4).map((news) => (
                    <div key={news._id} className="mb-4">
                      <Link
                        to={`/news/${news.id}`}
                        className="font-medium text-indigo-600 hover:underline"
                      >
                        {news.title}
                      </Link>
                    </div>
                  ))
                ) : (
                  <p>No trending news available.</p>
                )}
              </div>
            )}

            <div className="bg-gray-200 shadow p-6 rounded-md mt-6">
              <h2 className="text-lg font-semibold mb-4">Join as a Reporter</h2>
              <p className="text-gray-600 mb-4">
                It's free to sign up as a reporter and start contributing to the
                news!
              </p>
              <button
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
                onClick={handleClick}
              >
                Sign Up
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Region;
