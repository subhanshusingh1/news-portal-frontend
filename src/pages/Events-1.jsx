import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventById } from "../redux/slicers/EventSlice";

export default function Events() {
  const { eventId } = useParams(); // Get the eventId from the URL
  const dispatch = useDispatch();
  const { event, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventById(eventId)); // Fetch the event by ID
    }
  }, [dispatch, eventId]);

  const dummyDescription =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit..Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula justo sit amet odio luctus, a scelerisque erat dapibus. Curabitur vel purus ultricies, blandit ante ut, pretium augue. Mauris interdum neque a nisi rhoncus, sed posuere arcu varius. Integer eget purus id odio cursus dictum non ut urna";

  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({
      left: -carouselRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({
      left: carouselRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  // Handle the loading state early to prevent hook issues
  if (loading) return <div>Loading...</div>;

  // Fallback images (3 dummy images)
  const fallbackImages = [
    "https://via.placeholder.com/600x400/?text=Image+1",
    "https://via.placeholder.com/600x400/?text=Image+2",
    "https://via.placeholder.com/600x400/?text=Image+3",
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between p-4">
          <div className="text-center lg:text-left lg:w-1/2 mb-4 lg:mb-0">
            <h2 className="text-base/7 font-semibold text-indigo-600">
              {event?.reporterId?.name || "Reporter Name"}
            </h2>
            <p className="mt-4 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {event?.title || "Dummy Event Heading"}
            </p>
          </div>

          <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
            <div className="relative flex items-center">
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
                {(event?.profileImage || fallbackImages).length > 0 ? (
                  (event?.profileImage || fallbackImages).map((image, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-full sm:w-80 md:w-96 lg:w-[600px] h-[350px] md:h-[600px] lg:h-[600px] bg-gray-200"
                      style={{
                        scrollSnapAlign: "center",
                      }}
                    >
                      <img
                        alt={`Event Image ${index + 1}`}
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
              {event?.description ? event.description : dummyDescription.split(".").map((sentence, idx) => (
                <span key={idx}>{sentence}.<br /></span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
