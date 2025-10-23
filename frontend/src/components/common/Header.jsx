import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom';
// import { useAuthContext } from '../../context/AuthContext';

const Header = ({ toggleSidebar, setToggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  return (
    <div className="sticky top-0 inset-x-0 z-20 bg-white border-b border-gray-200 px-3">
      <div className="flex items-center py-2 justify-between">
        
        <div className='flex items-center'>
          <button type="button" onClick={() => setToggleSidebar(!toggleSidebar)} className="size-8 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-hidden focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-application-sidebar" aria-label="Toggle navigation" data-hs-overlay="#hs-application-sidebar">
            <span className="sr-only">Toggle Navigation</span>
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M15 3v18" /><path d="m8 9 3 3-3 3" /></svg>
          </button>

          <ol className="ms-3 flex items-center whitespace-nowrap">
            <li className="flex items-center text-sm text-gray-800 dark:text-neutral-400">
              Circle
              <svg className="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 dark:text-neutral-500" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </li>
            <li className="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400" aria-current="page">
              Dashboard
            </li>
          </ol>
        </div>

         <span>

          {isAuthenticated ? (
            <>
              <h2 className='capitalize'>Welcome, {user?.name}!</h2>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </span>
       
      </div>
    </div>
  )
}

export default Header
