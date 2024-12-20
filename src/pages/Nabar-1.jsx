import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useClerk, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirect
import { useDispatch } from "react-redux";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Region", href: "/region" },
  { name: "News", href: "/news/:id" },
  { name: "Events", href: "/events/:id" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut, signUp } = useClerk();
  const dispatch = useDispatch(); // Use dispatch for Redux action
  const navigate = useNavigate(); // Use navigate to redirect

  const handleLinkClick = () => {
    setMobileMenuOpen(false); // Close the mobile menu on link click
  };

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href} // Use 'to' instead of 'href'
                className="text-sm/6 font-semibold text-gray-900"
                onClick={handleLinkClick} // Close the mobile menu when a link is clicked
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Authentication Buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end px-4">
            <SignedOut>
              <Link
                to="/sign-in"
                className="text-sm font-semibold text-gray-900"
              >
                Log In <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                to="/sign-up"
                className="text-sm font-semibold text-gray-900 px-4"
              >
                Register <span aria-hidden="true">&rarr;</span>
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-gray-900 px-4"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  signOut(); // Correctly calling the signOut method
                }}
                className="text-sm font-semibold text-gray-900"
              >
                <span aria-hidden="true">&rarr;</span> Log Out
              </button>
            </SignedIn>
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href} // Use 'to' instead of 'href'
                      onClick={handleLinkClick} // Close the menu when a link is clicked
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <SignedOut>
                    <Link
                      to="/sign-in"
                      onClick={handleLinkClick} // Close the menu when a link is clicked
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/sign-up"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      onClick={() => {
                        handleLinkClick(); // Close the mobile menu first
                        const userData = {
                          email: "",
                          name: "",
                          clerkUserId: "",
                        };
                        handleSignUp(userData); // Then call the handleSignUp function
                      }}
                    >
                      Register
                    </Link>
                  </SignedOut>

                  <SignedIn>
                    <Link
                      to="/dashboard"
                      onClick={handleLinkClick} // Close the menu when a link is clicked
                      className="text-sm font-semibold text-gray-900"
                    >
                      Dashboard
                    </Link>
                    <br />
                    <button
                      onClick={() => {
                        signOut(); // Correctly calling the signOut method
                      }}
                      className="text-sm font-semibold text-gray-900"
                    >
                      Log Out <span aria-hidden="true">&rarr;</span>
                    </button>
                  </SignedIn>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  );
}
