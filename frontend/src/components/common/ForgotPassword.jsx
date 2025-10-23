import { useFormik } from "formik";
import { useAuth } from "../../hooks/useAuth"
import Email from "../ui/Email"
import * as yup from 'yup';
import { email } from "../../helpers/errors";
import { forgotPassword } from "../../api/authAPI";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const {loading} = useAuth();
  const formik = useFormik({
    initialValues:{
      email:""
    },
    validationSchema:yup.object({
      email:email
    }),
    onSubmit: async values=>{
      const output = await forgotPassword(values);
      if(output.success) {
        toast.success(output.message);
        formik.resetForm();
      }
      else {
        toast.error(output.message);
      }
    }
  });
  return (
    <div className="max-w-xl w-full mx-auto bg-white border border-gray-200 rounded-xl shadow-2xs">
      <div className="p-4 sm:p-7">
        <div className="text-center">
          <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Forgot password?</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            Remember your password?
            <a className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="../examples/html/signin.html">
              Sign in here
            </a>
          </p>
        </div>

        <div className="mt-5">
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-y-4">
              <Email label="Email Address" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.email} touched={formik.touched.email} />

              <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                {
                  loading ? 'loading...' : 'Reset password'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
