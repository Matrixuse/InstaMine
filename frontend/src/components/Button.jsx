// src/components/ui/Button.jsx
import React from 'react';
import { Loader } from 'lucide-react';

/**
 * A reusable button component with built-in loading state and variants.
 */
const Button = ({ children, onClick, loading, className = '', variant = 'primary', disabled = false, type = 'button' }) => {
    let baseStyles = 'px-4 py-2 font-semibold rounded-lg transition duration-200 shadow-md flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed';
    let variantStyles = '';

    switch (variant) {
        case 'primary':
            variantStyles = 'bg-blue-500 text-white hover:bg-blue-600';
            break;
        case 'secondary':
            variantStyles = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
            break;
        case 'danger':
            variantStyles = 'bg-red-500 text-white hover:bg-red-600';
            break;
        case 'success':
            variantStyles = 'bg-green-500 text-white hover:bg-green-600';
            break;
        case 'link':
            // Special case for icon buttons or text links without padding/background
            baseStyles = 'font-semibold transition duration-150 transform hover:scale-110 p-0';
            variantStyles = 'text-blue-500 hover:text-blue-700';
            break;
        default:
            variantStyles = 'bg-blue-500 text-white hover:bg-blue-600';
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variantStyles} ${className}`}
        >
            {loading ? <Loader size={20} className="animate-spin" /> : children}
        </button>
    );
};

export default Button;