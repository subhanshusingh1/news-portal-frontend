import React from 'react';
import { ChevronDown, X } from 'lucide-react';

const Dropdown = ({
  label,
  items = [],
  selected,
  setSelected,
  clear,
  dropdownRef,
  openDropdown,
  setOpenDropdown,
}) => {
  const selectedName = items.find((item) => item._id === selected)?.name || `Select ${label}`;

  return (
    <div className="relative">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      {/* Dropdown Toggle */}
      <div
        className="flex justify-between items-center border border-gray-300 rounded-lg p-2 cursor-pointer hover:border-gray-400"
        onClick={() =>
          setOpenDropdown((prev) => (prev === label ? null : label))
        }
        ref={dropdownRef}
      >
        <span className="text-gray-700 truncate">{selectedName}</span>
        <div className="flex items-center">
          {selected && (
            <X
              className="text-gray-400 hover:text-red-500 w-4 h-4 mr-2"
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
            />
          )}
          <ChevronDown className="text-gray-400 w-4 h-4" />
        </div>
      </div>

      {/* Dropdown Menu */}
      {openDropdown === label && (
        <ul className="absolute z-10 w-full bg-white shadow-lg border border-gray-200 rounded-lg mt-1 max-h-60 overflow-auto">
          {items.length > 0 ? (
            items.map((item) => (
              <li
                key={item._id}
                className={`p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                  selected === item._id ? 'bg-gray-100 font-semibold' : ''
                }`}
                onClick={() => {
                  setSelected(item._id);
                  setOpenDropdown(null);
                }}
              >
                {item.name}
              </li>
            ))
          ) : (
            <li className="p-2 text-sm text-gray-500 italic">No options available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
