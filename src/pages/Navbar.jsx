import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useClerk, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegionById } from "../redux/slicers/RegionSlice";
import RegionDropdown from "./nav-related/RegionDropdown"; // Import the RegionDropdown component

const navigation = [
  // { name: "Home", href: "/" },
  // { name: "About Us", href: "/about" },
  // { name: "News", href: "/news" },
  // { name: "Events", href: "/events" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signOut } = useClerk();

  const region = useSelector((state) => state.region.region);

  // Update selectedRegion when Redux state changes
  useEffect(() => {
    if (region) {
      setSelectedRegion(region);
    }
  }, [region]);

  // Handle region selection
  const handleRegionSelect = (region) => {
    dispatch(fetchRegionById({ id: region._id, regionType: region.regionType }));
    setSelectedRegion(region);

    // Navigate if "city" or "locality" is selected
    if (region.regionType === "city" || region.regionType === "locality") {
      navigate(`/region/${region._id}`);
    }

    setMobileMenuOpen(false); // Close mobile menu after region selection
  };

  // Handle closing the mobile menu
  const handleCloseMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">News Portal</span>
              <img
                alt="Logo"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
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

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-semibold text-gray-900"
                onClick={handleCloseMobileMenu} // Close menu after clicking a link
              >
                {item.name}
              </Link>
            ))}

            {/* Region Dropdown */}
            <div className="relative">
              <RegionDropdown
                onRegionSelect={(region) => {
                  handleRegionSelect(region); // Handle region selection
                  handleCloseMobileMenu(); // Close the mobile menu
                }}
              />
            </div>
          </div>

          {/* Authentication Buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <SignedOut>
              <Link to="/sign-in" className="text-sm font-semibold text-gray-900">
                Log In <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link to="/sign-up" className="text-sm font-semibold text-gray-900 px-4">
                Register <span aria-hidden="true">&rarr;</span>
              </Link>
            </SignedOut>
            <SignedIn>
              {/* <Link to="/dashboard" className="text-sm font-semibold text-gray-900 px-4">
                Dashboard
              </Link> */}
              <button
                onClick={() => signOut()}
                className="text-sm font-semibold text-gray-900"
              >
                Log Out <span aria-hidden="true">&rarr;</span>
              </button>
            </SignedIn>
          </div>
        </nav>

        {/* Mobile Menu */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <img
                  alt="Logo"
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </Link>
              <button
                type="button"
                onClick={handleCloseMobileMenu} // Close mobile menu
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <XMarkIcon className="size-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      onClick={handleCloseMobileMenu} // Close menu after selection
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Region Dropdown for Mobile */}
                <div className="py-6">
                  <RegionDropdown
                    onRegionSelect={(region) => {
                      handleRegionSelect(region); // Handle region selection
                      handleCloseMobileMenu(); // Close the mobile menu
                    }}
                  />
                </div>

                {/* Authentication Links */}
                <div className="py-6">
                  <SignedOut>
                    <Link
                      to="/sign-in"
                      className="block px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/sign-up"
                      className="block px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Register
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    {/* <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Dashboard
                    </Link> */}
                    <button
                      onClick={() => signOut()}
                      className="block px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Log Out
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
