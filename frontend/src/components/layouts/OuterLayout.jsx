import Header from '../common/Header'
import Footer from '../common/Footer'
import { Outlet } from 'react-router-dom'

const OuterLayout = () => {
    return (
        <main id="content" className={`transition-all duration-300`}>
            <Header />
            <div className='px-3 py-4 h-[calc(100vh-100px)] overflow-auto flex lg:items-center justify-center'>
                <Outlet />
            </div>
            <Footer />
        </main>
    )
}

export default OuterLayout
