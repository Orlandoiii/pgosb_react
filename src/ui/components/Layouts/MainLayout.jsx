import Navbar from "../../core/navbar/Navbar";
import Sidebar from "../../core/sidebar/Sidebar";

export default function MainLayout({ }) {
    return (
        <div className='flex h-screen overflow-hidden'>
            <Sidebar />
            <Navbar />
        </div>
    )
}