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
    <div className="w-full group">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-indigo-600"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 transition-all duration-200 group-focus-within:text-indigo-500 z-10">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            block w-full rounded-2xl border-2 border-gray-200 bg-white text-lg
            focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100
            disabled:bg-gray-50 disabled:text-gray-500
            transition-all duration-300
            py-4 pr-4
            transform hover:translate-y-[-2px] focus:translate-y-[-2px]
            hover:shadow-lg focus:shadow-xl
            ${icon ? 'pl-12' : 'pl-4'}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}
            ${className}
          `}
          style={{
            boxShadow: error
              ? '0 4px 6px -1px rgba(239, 68, 68, 0.1), 0 2px 4px -1px rgba(239, 68, 68, 0.06)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          }}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium animate-shake">
          {error}
        </p>
      )}
    </div>
  );
}