import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Section 1: Logo and Description */}
          <div className="mb-8 sm:mb-0">
            <h2 className="text-3xl font-semibold text-indigo-600 mb-4">NewsPortal</h2>
            <p className="text-gray-400">
              Stay updated with the latest news from around the world. Our platform delivers breaking news, insightful articles, and in-depth analyses.
            </p>
          </div>

          {/* Section 2: Useful Links */}
          <div className="mb-8 sm:mb-0">
            <h3 className="text-xl font-medium text-gray-300 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/home" className="hover:text-indigo-400">Home</a>
              </li>
              <li>
                <a href="/about" className="hover:text-indigo-400">About Us</a>
              </li>
              {/* <li>
                <a href="/contact" className="hover:text-indigo-400">Contact</a>
              </li> */}
              <li>
                <a href="/terms" className="hover:text-indigo-400">Terms & Conditions</a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-indigo-400">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Section 3: Social Media */}
          {/* <div className="mb-8 sm:mb-0">
            <h3 className="text-xl font-medium text-gray-300 mb-4">Follow Us</h3>
            <div className="flex space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400">
                <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M22 12c0 5.52-4.48 10-10 10s-10-4.48-10-10 4.48-10 10-10 10 4.48 10 10zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM11 16V8h2v8h-2zm-1-9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400">
                <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M23.4 4.2c-.9.4-1.8.7-2.7.8 1-.6 1.8-1.5 2.1-2.6-.9.5-1.8.8-2.8 1-.9-.9-2.3-1.5-3.7-1.5-3 0-5.4 2.5-5.4 5.5 0 .4 0 .8.1 1.2-4.5-.2-8.5-2.4-11.2-5.7-.5.9-.7 1.9-.7 3 0 2.1 1.1 4.1 2.7 5.2-1-.1-1.9-.3-2.7-.8-.1 2.1 1.4 4.2 3.5 4.6-.6.2-1.2.3-1.9.3-1.4 0-2.7-.5-3.8-1.3 2.8 3.3 7.2 5.4 12.1 5.4 14.5 0 22.5-12 22.5-22.5v-1c0-.5-.1-.9-.2-1.3.9-.6 1.7-1.3 2.3-2.1z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400">
                <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M20.45 0H3.55C2.7 0 2 .7 2 1.55v20.9c0 .85.7 1.55 1.55 1.55h16.9c.85 0 1.55-.7 1.55-1.55V1.55c0-.85-.7-1.55-1.55-1.55zM7.1 19.4H4.7V9.7h2.4v9.7zM6 8.1c-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4 1.4.6 1.4 1.4-.6 1.4-1.4 1.4zM19.4 19.4h-2.4v-5.4c0-1.3-.5-2.2-1.7-2.2-1.1 0-1.6.8-1.7 1.7v5.9h-2.4v-9.7h2.4v1.4c.3-.5.9-.8 1.6-.8 1.5 0 2.7 1.1 2.7 2.7v5.4h-.1z"/>
                </svg>
              </a>
            </div>
          </div> */}

          {/* Section 4: Contact Info */}
          <div>
            <h3 className="text-xl font-medium text-gray-300 mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <p className="text-gray-400">Email: <a href="mailto:contact@newsportal.com" className="hover:text-indigo-400">contact@newsportal.com</a></p>
              </li>
              <li>
                <p className="text-gray-400">Phone: +1 (800) 123-4567</p>
              </li>
              <li>
                <p className="text-gray-400">Address: 123 News Ave, City, State, 12345</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} All rights reserved</p>
          <p>Made with &hearts; by Subhanshu and Bhavik</p>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
