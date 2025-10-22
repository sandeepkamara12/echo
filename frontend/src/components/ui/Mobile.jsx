import React from 'react'
import ErrorMessage from '../common/ErrorMessage'

const Mobile = ({ label, name, value, onChange, onBlur, error, touched }) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm mb-2 dark:text-white">{label}</label>
            <div className="relative">
                <input type="tel" id={name} name={name} value={value} onChange={onChange} onBlur={onBlur} className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" />
            </div>
            <ErrorMessage error={error} touched={touched} />
        </div>
    )
}

export default Mobile
