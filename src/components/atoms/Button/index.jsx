import React from 'react'

export const Button = ({ title }) => {
    return (
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer font-medium text-center">
            <button>{title}</button>
        </div>
    )
}
