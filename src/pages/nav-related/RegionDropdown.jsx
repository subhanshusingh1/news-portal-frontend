import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegionSelector = () => {
  const navigate = useNavigate();

  // State management for each level
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);

  // Selected values
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');

  const [openDropdown, setOpenDropdown] = useState(null);
  const [error, setError] = useState(null);

  const dropdownRefs = {
    state: useRef(null),
    district: useRef(null),
    city: useRef(null),
    locality: useRef(null)
  };

  // Fetch data function
  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  // Fetch states on component mount
  useEffect(() => {
    const loadStates = async () => {
      try {
        const stateData = await fetchData(`${import.meta.env.VITE_REGION_SERVICE_URL}/api/v1/region/state`);
        setStates(stateData);
        setError(null);
      } catch (error) {
        console.error('Error fetching states:', error);
        setError('Failed to load states. Please try again.');
        setStates([]);
      }
    };

    loadStates();
  }, []);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDropdown = Object.entries(dropdownRefs).every(([key, ref]) =>
        !ref.current || !ref.current.contains(event.target)
      );

      if (isOutsideDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch Districts
  const fetchDistricts = async (stateId) => {
    if (!stateId) return;

    try {
      const districtData = await fetchData(`${import.meta.env.VITE_REGION_SERVICE_URL}/api/v1/region/district/${stateId}`);
      setDistricts(districtData);
      setCities([]);
      setLocalities([]);
      setSelectedDistrict('');
      setSelectedCity('');
      setSelectedLocality('');
      setError(null);
    } catch (error) {
      console.error('Error fetching districts:', error);
      setError('Failed to load districts. Please try again.');
      setDistricts([]);
    }
  };

  // Fetch Cities
  const fetchCities = async (districtId) => {
    if (!districtId) return;

    try {
      const cityData = await fetchData(`${import.meta.env.VITE_REGION_SERVICE_URL}/api/v1/region/city/${districtId}`);
      setCities(cityData);
      setLocalities([]);
      setSelectedCity('');
      setSelectedLocality('');
      setError(null);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setError('Failed to load cities. Please try again.');
      setCities([]);
    }
  };

  // Fetch Localities
  const fetchLocalities = async (cityId) => {
    if (!cityId) return;

    try {
      const localityData = await fetchData(`${import.meta.env.VITE_REGION_SERVICE_URL}/api/v1/region/locality/${cityId}`);
      setLocalities(localityData);
      setSelectedLocality('');
      setError(null);
    } catch (error) {
      console.error('Error fetching localities:', error);
      setError('Failed to load localities. Please try again.');
      setLocalities([]);
    }
  };

  // Handle selection changes
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    fetchDistricts(stateId);
    setOpenDropdown(null);
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    fetchCities(districtId);
    setOpenDropdown(null);
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    fetchLocalities(cityId);
    setOpenDropdown(null);
  };

  const handleLocalityChange = (localityId) => {
    if (selectedLocality !== localityId) {
      setSelectedLocality(localityId);
      setTimeout(() => {
        navigate(`/region/locality/${localityId}`);
      }, 100);
    }
  };

  const clearSelection = (level) => {
    switch (level) {
      case 'state':
        setSelectedState('');
        setSelectedDistrict('');
        setSelectedCity('');
        setSelectedLocality('');
        setDistricts([]);
        setCities([]);
        setLocalities([]);
        break;
      case 'district':
        setSelectedDistrict('');
        setSelectedCity('');
        setSelectedLocality('');
        setCities([]);
        setLocalities([]);
        break;
      case 'city':
        setSelectedCity('');
        setSelectedLocality('');
        setLocalities([]);
        break;
      case 'locality':
        setSelectedLocality('');
        break;
    }
  };

  const getSelectedName = (list, selectedId) => {
    const selected = list.find(item => item._id === selectedId);
    return selected ? selected.name : 'Select';
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow-md rounded-lg space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* State Dropdown */}
      <div ref={dropdownRefs.state} className="relative">
        <div
          className="flex items-center justify-between bg-gray-100 p-3 rounded-md cursor-pointer"
          onClick={() => setOpenDropdown(openDropdown === 'state' ? null : 'state')}
        >
          <div className="flex items-center">
            <MapPin className="mr-2 text-gray-500" size={20} />
            <span className="text-sm">
              {selectedState ? getSelectedName(states, selectedState) : 'Select State'}
            </span>
          </div>
          {selectedState ? (
            <X
              className="text-gray-500 hover:text-red-500"
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                clearSelection('state');
              }}
            />
          ) : (
            <ChevronDown className="text-gray-500" size={20} />
          )}
        </div>

        {openDropdown === 'state' && (
          <div className="absolute z-10 w-full bg-white shadow-lg max-h-60 overflow-y-auto rounded-md border mt-1">
            {states.map((state) => (
              <div
                key={state._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  handleStateChange({ target: { value: state._id } });
                }}
              >
                {state.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* District Dropdown */}
      {selectedState && (
        <div ref={dropdownRefs.district} className="relative">
          <div
            className="flex items-center justify-between bg-gray-100 p-3 rounded-md cursor-pointer"
            onClick={() => setOpenDropdown(openDropdown === 'district' ? null : 'district')}
          >
            <div className="flex items-center">
              <MapPin className="mr-2 text-gray-500" size={20} />
              <span className="text-sm">
                {selectedDistrict ? getSelectedName(districts, selectedDistrict) : 'Select District'}
              </span>
            </div>
            {selectedDistrict ? (
              <X
                className="text-gray-500 hover:text-red-500"
                size={20}
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection('district');
                }}
              />
            ) : (
              <ChevronDown className="text-gray-500" size={20} />
            )}
          </div>

          {openDropdown === 'district' && (
            <div className="absolute z-10 w-full bg-white shadow-lg max-h-60 overflow-y-auto rounded-md border mt-1">
              {districts.map((district) => (
                <div
                  key={district._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleDistrictChange({ target: { value: district._id } });
                  }}
                >
                  {district.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* City Dropdown */}
      {selectedDistrict && (
        <div ref={dropdownRefs.city} className="relative">
          <div
            className="flex items-center justify-between bg-gray-100 p-3 rounded-md cursor-pointer"
            onClick={() => setOpenDropdown(openDropdown === 'city' ? null : 'city')}
          >
            <div className="flex items-center">
              <MapPin className="mr-2 text-gray-500" size={20} />
              <span className="text-sm">
                {selectedCity ? getSelectedName(cities, selectedCity) : 'Select City'}
              </span>
            </div>
            {selectedCity ? (
              <X
                className="text-gray-500 hover:text-red-500"
                size={20}
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection('city');
                }}
              />
            ) : (
              <ChevronDown className="text-gray-500" size={20} />
            )}
          </div>

          {openDropdown === 'city' && (
            <div className="absolute z-10 w-full bg-white shadow-lg max-h-60 overflow-y-auto rounded-md border mt-1">
              {cities.map((city) => (
                <div
                  key={city._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleCityChange({ target: { value: city._id } });
                  }}
                >
                  {city.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Locality Dropdown */}
      {selectedCity && (
        <div ref={dropdownRefs.locality} className="relative">
          <div
            className="flex items-center justify-between bg-gray-100 p-3 rounded-md cursor-pointer"
            onClick={() => setOpenDropdown(openDropdown === 'locality' ? null : 'locality')}
          >
            <div className="flex items-center">
              <MapPin className="mr-2 text-gray-500" size={20} />
              <span className="text-sm">
                {selectedLocality ? getSelectedName(localities, selectedLocality) : 'Select Locality'}
              </span>
            </div>
            {selectedLocality ? (
              <X
                className="text-gray-500 hover:text-red-500"
                size={20}
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection('locality');
                }}
              />
            ) : (
              <ChevronDown className="text-gray-500" size={20} />
            )}
          </div>

          {openDropdown === 'locality' && (
            <div className="absolute z-10 w-full bg-white shadow-lg max-h-60 overflow-y-auto rounded-md border mt-1">
              {localities.map((locality) => (
                <div
                  key={locality._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleLocalityChange(locality._id)}
                >
                  {locality.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegionSelector;
