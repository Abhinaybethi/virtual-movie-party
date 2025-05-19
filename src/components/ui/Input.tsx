import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const inputClasses = `
    bg-gray-800 
    text-white 
    rounded-lg 
    border 
    ${error ? 'border-red-500' : 'border-gray-700'} 
    px-4 
    py-2 
    focus:outline-none 
    focus:ring-2 
    focus:ring-purple-500 
    transition-colors 
    duration-200
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-gray-300 mb-1 text-sm">{label}</label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;