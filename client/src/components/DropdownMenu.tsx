import { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownMenuProps {
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
  disabled?: boolean;
}

export default function DropdownMenu({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select option',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  optionClassName = '',
  disabled = false,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={
          buttonClassName || `
            text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 
            font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center 
            dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `
        }
      >
        {displayText}
        <svg 
          className={`w-2.5 h-2.5 ms-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 10 6"
        >
          <path 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className={`
            absolute top-full left-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 mt-1
            ${menuClassName}
          `}
        >
          <ul className="py-2 text-sm text-gray-700">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-150
                    ${selectedValue === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                    ${optionClassName}
                  `}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
