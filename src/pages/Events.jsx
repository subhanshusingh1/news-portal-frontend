import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa"; // Reporter Icon
import { FiArrowRight, FiChevronDown } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { fetchEventById } from "../redux/slicers/EventSlice"; // Main event fetch action
import { fetchEventsByRegion } from "../redux/slicers/AllEventsSlice"; // Upcoming events fetch action
import { useNavigate, useParams } from "react-router-dom"; // Import useParams to get URL parameters

const EventsSection = () => {
  const [loadingEventId, setLoadingEventId] = useState(null); // Track loading state for each card
  const [visibleEventCount, setVisibleEventCount] = useState(3); // Track visible events for Load More
  
  const { id } = useParams(); // Get the dynamic event ID from the URL
  const dispatch = useDispatch(); // Dispatch to fetch data
  const navigate = useNavigate();

  // Select the state from Redux for the main event
  const { event: mainEvent, loading: loadingMainEvent, error: errorMainEvent } = useSelector((state) => state.events);

  // Select the state from Redux for the upcoming events
  const { events: upcomingEvents, loading: loadingUpcomingEvents, error: errorUpcomingEvents } = useSelector((state) => state.AllEvents);

  // Fetch the main event when the component mounts or when the event ID changes
  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id)); // Fetch main event with the dynamic ID
    }
    window.scrollTo(0, 0); // Scroll to the top on initial load
  }, [dispatch, id]);

  // Fetch upcoming events when the component mounts
  useEffect(() => {
    dispatch(fetchEventsByRegion(1)); // Fetch upcoming events for region 1 (modify as needed)
  }, [dispatch]);

  // Handle clicking on an event card
  const handleCardClick = (eventId) => {
    setLoadingEventId(eventId);

    setTimeout(() => {
      navigate(`/events/${eventId}`);
      setLoadingEventId(null);
    }, 2000);
  };

  // Fallback event data (to show if no main event data is available)
  const fallbackEvent = {
    id: 0,
    title: "Default Event Title",
    desc: "This is a fallback event description in case the main event is not available.",
    time: "Not Available",
    img: "https://via.placeholder.com/1200x500",  // Placeholder image
    location: "Not Available",
    reporter: "Unknown",  // Fallback reporter
    timestamp: "Not Available", // Fallback timestamp
  };

  // Choose either the fetched event or the fallback event for the main event
  const currentEvent = (loadingMainEvent || !mainEvent) ? fallbackEvent : mainEvent;

  // Format the timestamp (example: "2 hours ago")
  const formatTimestamp = (timestamp) => {
    if (timestamp === "Not Available") return "Not Available";
    const diffInMinutes = Math.floor((new Date() - new Date(timestamp)) / 60000); // Convert to minutes
    if (diffInMinutes < 60) return `${diffInMinutes} minute(s) ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} hour(s) ago`;
  };

  // Fallback layout for the Upcoming Events section
  const upcomingEventFallback = Array.from({ length: 3 }).map((_, index) => ({
    id: index,
    title: "Loading...",
    desc: "Please wait while we load upcoming events.",
    time: "Not Available",
    img: "https://via.placeholder.com/1200x500",
    location: "Not Available",
  }));

  return (
    <div className={`font-sans py-8 px-4 sm:px-8 lg:px-16 mt-16 ${loadingEventId ? "cursor-wait" : ""}`}>
      {/* Main Event Section */}
      <section className="container mx-auto max-w-screen-lg p-4">
        <h1 className="text-4xl font-bold text-gray-800 leading-tight text-left">
          Exciting Events Around the Corner: Mark Your Calendars
        </h1>
        
        <div className="flex items-center text-left mt-2">
          {/* Display dynamic reporter name */}
          <p className="text-gray-500">
            <span className="flex items-center">
              <FaUserCircle className="text-gray-600 mr-2" size={16} /> {currentEvent.reporter} {/* Dynamic reporter name */}
            </span>
          </p>
          {/* Display dynamic timestamp */}
          <p className="text-gray-400 ml-4">{formatTimestamp(currentEvent.timestamp)}</p>
        </div>

        {/* Display the Main Event or Fallback Event */}
        <img
          src={currentEvent.img}
          alt={currentEvent.title}
          className="w-full h-96 object-cover rounded-lg mt-4"
        />
        <div className="text-gray-600 mt-4 leading-relaxed text-left px-8 lg:px-16">
          <h2 className="text-2xl font-semibold text-gray-800">{currentEvent.title}</h2>
          <p className="mb-4">{currentEvent.desc}</p>
          <p className="text-sm text-gray-500">{currentEvent.time}</p>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="container mx-auto max-w-screen-lg mt-8 p-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-left">Upcoming Events</h2>
        
        {loadingUpcomingEvents ? (
          <div className="flex flex-col gap-4 mt-4">
            {/* Skeleton loader for each event */}
            {upcomingEventFallback.map((_, index) => (
              <div key={index} className="flex flex-row items-start p-4 border rounded-lg shadow-sm animate-pulse">
                <div className="w-1/3 h-36 bg-gray-300 rounded-md mr-4"></div>
                <div className="flex-1">
                  <div className="w-32 h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="w-40 h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mt-4">
            {/* Show only a limited number of events initially */}
            {upcomingEvents.slice(0, visibleEventCount).map((event) => (
              <div
                key={event.id}
                className={`flex flex-row items-start p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer ${loadingEventId === event.id ? "opacity-50" : ""}`}
                onClick={() => handleCardClick(event.id)}
              >
                {/* Image */}
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-1/3 h-36 object-cover rounded-md mr-4"
                />
                {/* Text Content */}
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full mb-2">
                    {event.location}
                  </span>
                  <h3 className="font-bold text-lg text-gray-800">{event.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{event.desc}</p>
                  <p className="text-xs text-gray-400 mt-1">{event.time}</p>
                  <div className="mt-2">
                    {loadingEventId === event.id && (
                      <span className="text-blue-500 flex items-center">
                        <FiArrowRight className="mr-2" />
                        Redirecting...
                      </span>
                    )}
                    {loadingEventId !== event.id && (
                      <span className="text-blue-500 mt-2 hover:underline">Learn More</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {upcomingEvents.length > 3 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleEventCount(visibleEventCount + 3)} // Increment by 3 for loading more
              className="flex items-center text-blue-500 font-semibold hover:underline"
            >
              <span>Load More Events</span>
              <FiChevronDown className="ml-2" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default EventsSection;
