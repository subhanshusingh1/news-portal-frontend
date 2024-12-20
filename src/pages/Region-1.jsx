import React, { useState } from "react";
import { FaEye, FaRegComment, FaClock, FaMapPin } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const Region = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNewsCardClick = (newsId) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/news/${newsId}`);
    }, 1000);
  };

  const handleEventsCardClick = (eventId) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/events/${eventId}`);
      setIsLoading(false);
    }, 1000);
  };

  const handleClick = () => {
    navigate("/sign-up");
  };

  return (
    <div className={`min-h-screen pt-12 ${isLoading ? "blur-sm" : ""}`}>
      {/* Banner Section */}
      <div className="w-full bg-white text-gray-800 py-8 px-8 lg:px-24 flex flex-col lg:flex-row justify-between items-center">
        {/* Left Section of Banner: Raipur Information */}
        <div className="flex flex-col space-y-6 max-w-lg">
          <h1 className="text-4xl font-extrabold leading-tight text-center lg:text-left">
            Raipur
          </h1>
          <p className="text-sm text-gray-700 max-w-md">
            Raipur, the capital city of Chhattisgarh, is an emerging hub of
            commerce, technology, and culture. Known for its scenic beauty, rich
            cultural heritage, and rapid development, Raipur is becoming one of
            the most sought-after destinations in India. Stay updated with the
            latest news from this vibrant region.
          </p>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition">
            Subscribe for Latest News
          </button>
        </div>

        {/* Right Section of Banner: Assigned Reporter and Editor */}
        <div className="flex flex-col space-y-6 max-w-sm mt-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Reporter and Editor Assigned
          </h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-gray-700">
              <img
                src="https://via.placeholder.com/50x50"
                alt="Editor"
                className="h-12 w-12 rounded-full border-2 border-indigo-600"
              />
              <div>
                <span className="text-sm font-semibold">Editor: </span>
                <span className="text-lg font-bold text-gray-900">
                  John Doe
                </span>
                <div className="text-xs text-gray-500">Senior Editor</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-gray-700">
              <img
                src="https://via.placeholder.com/50x50"
                alt="Reporter"
                className="h-12 w-12 rounded-full border-2 border-indigo-600"
              />
              <div>
                <span className="text-sm font-semibold">Reporter: </span>
                <span className="text-lg font-bold text-gray-900">
                  Jane Smith
                </span>
                <div className="text-xs text-gray-500">Field Reporter</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-16 mt-6">
        <div className="flex lg:flex-nowrap flex-wrap justify-center lg:space-x-6 space-x-0 overflow-x-auto">
          {/* Left Section */}
          <main className="w-full lg:w-2/3 mb-6 lg:mb-0 px-4 mt-4">
            {/* First Article with Full Width Image */}
            <article className="rounded-md mb-6">
              <div className="mb-4">
                <img
                  src="https://via.placeholder.com/1200x600?text=Breaking+News+Image"
                  alt="Breaking News"
                  className="w-full h-64 object-cover rounded-md cursor-pointer"
                  onClick={() => handleNewsCardClick(1)}
                />
              </div>

              <div className="flex justify-start items-center text-gray-500 text-sm space-x-6 mb-4">
                <div className="text-sm text-gray-500">
                  <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                    Raipur
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Breaking News: Government Announces New Digital Currency
              </h2>

              <p className="text-gray-600 mb-4">
                In a landmark move, the government has unveiled plans to launch
                a digital currency aimed at revolutionizing the economy...
              </p>

              {/* Comments, Views, Tag section visible on desktop only */}
              <div className="hidden lg:flex justify-start items-center text-gray-500 text-sm space-x-6 mb-4">
                <div className="flex items-center space-x-1">
                  <FaClock className="h-5 w-5 text-gray-500" />
                  <span className="inline-block">10</span>
                  <span className="inline-block">min</span>
                </div>

                <div className="flex items-center space-x-1">
                  <span>3.2M</span>
                  <FaEye className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex items-center space-x-1">
                  <span>200</span>
                  <FaRegComment className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </article>

            {/* Other Articles with Image on Left and Content on Right in Both Desktop and Mobile */}
            {Array.from({ length: 6 }).map((_, idx) => (
              <article
                key={idx}
                className="rounded-md mb-6 flex flex-col lg:flex-row justify-between items-start"
              >
                <div className="w-full lg:w-1/4 lg:mr-4 mb-4 lg:mb-0">
                  <img
                    src="https://via.placeholder.com/300x200?text=News+Image"
                    alt="News Image"
                    className="w-full h-auto object-cover rounded-md cursor-pointer"
                    onClick={() => handleNewsCardClick(idx + 2)}
                  />
                </div>
                <div className="w-full lg:w-3/4">
                  <h3 className="text-xl font-semibold mb-2">
                    Major Economic Shift Expected as Market Rebounds #{idx + 1}
                  </h3>

                  <p className="text-gray-600 mb-4">
                    The stock market has seen a significant rebound following
                    recent dips, with analysts predicting an optimistic
                    future...
                  </p>

                  {/* Comments, Views, Tag section visible on desktop only */}
                  <div className="hidden lg:flex justify-start items-center text-gray-500 text-sm space-x-6 mb-4">
                    <div className="text-sm text-gray-500">
                      <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                        Raipur
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaClock className="h-5 w-5 text-gray-500" />
                      <span className="inline-block">10</span>
                      <span className="inline-block">min</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <span>3.2M</span>
                      <FaEye className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>200</span>
                      <FaRegComment className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md mx-auto block">
              See more
            </button>
          </main>

          {/* Right Section: Sidebar */}
          <aside className="w-full lg:w-1/3 px-4 mt-4">
            {/* Popular Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Popular</h2>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex items-start space-x-4 mb-4">
                  <div className="text-sm">#{idx + 1}</div>
                  <div className="flex-1">
                    <Link
                      to={`/news/${idx + 1}`}
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      Economic Policy Change Could Impact Markets #{idx + 1}
                    </Link>
                    <div className="text-sm text-gray-500">3 min read</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Events Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-md mb-6 overflow-hidden cursor-pointer"
                  onClick={() => handleEventsCardClick(idx + 1)}
                >
                  <img
                    src="https://via.placeholder.com/400x200?text=Event+Image"
                    alt={`Event ${idx + 1}`}
                    className="w-full object-cover h-48"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-lg">
                      Tech Conference 2024 #{idx + 1}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaMapPin className="text-indigo-600 mr-2" />
                      <span>New York City, USA</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Join the leading experts in tech as they discuss the
                      future of AI and its impact on industries worldwide.
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md mt-4">
                  See More
                </button>
              </div>
            </div>

            {/* Tags Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Discover</h2>
              <div className="flex flex-wrap gap-2">
                {["Politics", "Economy", "Technology", "Health"].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-gray-200 text-sm rounded-full hover:bg-gray-300"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Join as a Reporter Section */}
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
