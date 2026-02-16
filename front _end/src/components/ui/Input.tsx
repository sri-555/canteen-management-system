import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export function Input({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label &&
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-1.5">

          {label}
        </label>
      }
      <div className="relative">
        {icon &&
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        }
        <input
          id={inputId}
          className={`
            block w-full rounded-xl border-gray-200 bg-white shadow-sm
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            disabled:bg-gray-50 disabled:text-gray-500
            transition-colors duration-200
            ${icon ? 'pl-10' : 'pl-3'}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props} />

      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>);

}