import Header from '../common/Header'
import Footer from '../common/Footer'
import { useState } from 'react';
import Sidebar from '../common/Sidebar';
import { Outlet } from 'react-router-dom';

const SidebarLayout = () => {
    const [toggleSidebar, setToggleSidebar] = useState(false);
    return (
        <main id="content" className={`${toggleSidebar ? 'ps-64' : 'ps-0'} transition-all duration-300`}>
            <Header toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />
            <Sidebar toggleSidebar={toggleSidebar} />
            <div className='px-3 py-4 h-[calc(100vh-100px)] overflow-auto'>
            <Outlet />
            </div>
            <Footer />
        </main>
    )
}

export default SidebarLayout
