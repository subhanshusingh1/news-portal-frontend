import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkSubscriptionStatus, fetchSubscribedRegions, subscribeToRegion } from "../redux/slicers/SubscriptionSlice";
import { fetchNewsForSubscribedRegions } from "../redux/slicers/SubscribedNewsSlice";
import { useAuth } from "@clerk/clerk-react"; // Clerk React hook to get the user context

export default function EditorsPicks() {
  const dispatch = useDispatch();
  const { userId } = useAuth(); // Get the authenticated userId from Clerk

  const [selectedRegion, setSelectedRegion] = useState(null); // State for dropdown selection
  const [isSubscribing, setIsSubscribing] = useState(false); // To track the subscribing process
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(null); // To track subscription success/failure

  // Subscription and regions data from Redux
  const {
    subscribed,
    status: subscriptionStatus,
    error: subscriptionError,
    regions, // List of subscribed regions
    regionsStatus,
  } = useSelector((state) => state.subscription);

  const {
    articles,
    status: newsStatus,
    error: newsError,
  } = useSelector((state) => state.news);

  // Fetch subscription status and regions when the component mounts
  useEffect(() => {
    if (userId) {
      dispatch(checkSubscriptionStatus({ userId })); // Check if user is subscribed
      dispatch(fetchSubscribedRegions(userId)); // Fetch subscribed regions
    }
  }, [dispatch, userId]);

  // Fetch news for the selected region
  useEffect(() => {
    if (selectedRegion && userId) {
      dispatch(fetchNewsForSubscribedRegions({ userId, ...selectedRegion }));
    }
  }, [dispatch, selectedRegion, userId]);

  // Handle dropdown selection
  const handleRegionChange = (e) => {
    const [regionId, regionType] = e.target.value.split(",");
    setSelectedRegion({ regionId, regionType });
  };

  // Handle Subscription
  const handleSubscribe = async () => {
    if (selectedRegion && userId) {
      setIsSubscribing(true);
      console.log("Subscribing to region:", selectedRegion); 
      alert('Subscribing to region:');// Debug line
      try {
        await dispatch(subscribeToRegion({ userId, ...selectedRegion }));
        setSubscriptionSuccess(true); // Successfully subscribed
      } catch (error) {
        setSubscriptionSuccess(false); // Subscription failed
        console.error("Subscription error:", error); // Log the error
      } finally {
        setIsSubscribing(false);
      }
    }
  };
  

  // Display loading or error messages
  if (
    subscriptionStatus === "loading" ||
    newsStatus === "loading" ||
    regionsStatus === "loading"
  ) {
    return <div>Loading...</div>;
  }

  if (subscriptionError || newsError) {
    return <div>{subscriptionError || newsError}</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-5">
              Editors Picks
            </h2>
          </div>
          {!subscribed && (
            <div>
              <button
                onClick={() => {console.log('Button clicked'); handleSubscribe()}}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <span className="animate-spin">⏳ Subscribing...</span>
                ) : (
                  "Subscribe"
                )}
              </button>
              {subscriptionSuccess === true && (
                <div className="mt-2 text-green-500 font-bold">
                  Successfully subscribed to the region!
                </div>
              )}
              {subscriptionSuccess === false && (
                <div className="mt-2 text-red-500 font-bold">
                  Failed to subscribe. Please try again.
                </div>
              )}
            </div>
          )}
        </div>

        {subscribed ? (
          regions && regions.length > 0 ? (
            <div>
              {/* Dropdown Menu */}
              <div className="mb-5">
                <label htmlFor="region-select" className="text-gray-700">
                  Select a Region:
                </label>
                <select
                  id="region-select"
                  className="ml-3 p-2 border rounded"
                  onChange={handleRegionChange}
                  value={selectedRegion ? `${selectedRegion.regionId},${selectedRegion.regionType}` : ""}
                >
                  <option value="">-- Select --</option>
                  {regions.map((region) => (
                    <option
                      key={region.regionId}
                      value={`${region.regionId},${region.regionType}`}
                    >
                      {region.regionType}: {region.regionName}
                    </option>
                  ))}
                </select>
              </div>

              {/* News Grid */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {Array.isArray(articles) && articles.length > 0 ? (
                  articles.map((product) => (
                    <a key={product.id} href={product.href} className="group">
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          alt={product.imageAlt}
                          src={product.imageSrc}
                          className="w-full h-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75"
                          style={{ maxWidth: "100%" }}
                        />
                      </div>
                      <h3 className="mt-4 text-sm text-gray-700">
                        {product.name}
                      </h3>
                    </a>
                  ))
                ) : (
                  <div>No news available for the selected region.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[400px] text-center text-gray-500">
              <p className="text-lg font-bold">
                You are subscribed but no regions are currently assigned to your
                account. Please contact support for assistance.
              </p>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center min-h-[400px] text-center text-gray-500">
            <p className="text-lg font-bold">
              Subscribe to see exclusive news and updates from your region!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
