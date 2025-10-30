import React, { InputHTMLAttributes, useState } from 'react';
import EyeIcon from '../icons/EyeIcon';
import EyeOffIcon from '../icons/EyeOffIcon';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ type, label, icon, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      {label && <label htmlFor={props.id} className="block text-sm font-medium text-gray-500 mb-2">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...props}
          type={isPassword && !showPassword ? 'password' : 'text'}
          className={`
            w-full py-4 px-6 ${icon ? 'pl-14' : ''} ${isPassword ? 'pr-14' : ''}
            bg-gray-100/60 rounded-full
            text-gray-800 placeholder-gray-400
            border border-transparent
            focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white
            transition-all duration-300
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center justify-center w-14 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <div className="relative w-5 h-5" aria-hidden="true">
              <EyeIcon
                className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                  showPassword ? 'opacity-0 transform -rotate-90 scale-75' : 'opacity-100 transform rotate-0 scale-100'
                }`}
              />
              <EyeOffIcon
                className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                  showPassword ? 'opacity-100 transform rotate-0 scale-100' : 'opacity-0 transform rotate-90 scale-75'
                }`}
              />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
