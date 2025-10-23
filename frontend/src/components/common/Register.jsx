import { Link } from 'react-router-dom'
import { useFormik } from 'formik';
import * as yup from 'yup';
import Text from '../ui/Text';
import Email from '../ui/Email';
import Password from '../ui/Password';
import Mobile from '../ui/Mobile';
import ImageUpload from '../ui/ImageUpload';
import { registerUser } from '../../api/authAPI.js';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { email, image, mobile, name, registerPassword } from '../../helpers/errors.js';
import { useAuth } from '../../hooks/useAuth.js';

const Register = () => {
    const {loading} = useAuth();
    const fileInputRef = useRef(null);
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            mobile: "",
            image: null
        },
        validationSchema: yup.object({
            name: name,
            email: email,
            password: registerPassword,
            mobile: mobile,
            image: image
        }),
        onSubmit: async values => {
            const formData = new FormData();

            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('mobile', values.mobile);
            formData.append('password', values.password);
            formData.append('image', values.image);

            const output = await registerUser(formData);

            if (output?.success) {
                toast.success(output?.message);
                formik.resetForm();
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
            else {
                toast.error(output?.message);
            }
        }
    });
    return (
        <div className="max-w-xl w-full mx-auto bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-900 dark:border-neutral-700">
            <div className="p-4 sm:p-7">
                <div className="text-center">
                    <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign up</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                        Already have an account?
                        <Link to="/login" className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500">
                            Sign in here
                        </Link>
                    </p>
                </div>

                <div className="mt-5">
                    <button type="button" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                        <svg className="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
                            <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4" />
                            <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853" />
                            <path d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05" />
                            <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335" />
                        </svg>
                        Sign up with Google
                    </button>

                    <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">Or</div>

                    <form onSubmit={formik.handleSubmit}>
                        <div className="grid gap-y-4">
                            <Text label="Name" name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.name} touched={formik.touched.name} />
                            <Email label="Email Address" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.email} touched={formik.touched.email} />
                            <Password label="Password" name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.password} touched={formik.touched.password} />
                            <Mobile label="Mobile" name="mobile" value={formik.values.mobile} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.mobile} touched={formik.touched.mobile} />
                            <ImageUpload label="Image" name="image" onChange={(e) => formik.setFieldValue("image", e.currentTarget.files[0])} onBlur={formik.handleBlur} error={formik.errors.image} touched={formik.touched.image} ref={fileInputRef} />
                            <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                {
                                    loading ? 'loading...' : 'Sign up'
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
