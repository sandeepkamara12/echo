import ErrorMessage from "../common/ErrorMessage"

const ImageUpload = ({ label, name, onChange, onBlur, error, touched, ref }) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm mb-2 dark:text-white">{label}</label>
            <input ref={ref} type="file" id={name} name={name} onChange={onChange} onBlur={onBlur} accept="image/*" className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4" />
             <ErrorMessage error={error} touched={touched} />
        </div>
    )
}

export default ImageUpload