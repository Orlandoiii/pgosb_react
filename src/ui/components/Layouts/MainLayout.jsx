import { ToastContainer } from "react-toastify";
import Navbar from "../../core/navbar/Navbar";
import Sidebar from "../../core/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

export default function MainLayout({ }) {


   return (
      <>
         <div className='relative flex h-screen overflow-hidden'>

            <Sidebar />
            <div className='w-full overflow-y-auto overflow-x-hidden'>
               <Navbar />
               <main className='w-full h-auto mx-auto p-4 mt-4'>
                  <Outlet />
               </main>



            </div>

         </div>
         <div id="modal-root"></div>

         <ToastContainer stacked={true}
            position="top-center"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            draggable={true}
            pauseOnHover={true}
            theme="light"

         ></ToastContainer>


      </>
   )
}