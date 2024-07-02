import { ToastContainer } from "react-toastify";
import Navbar from "../../core/navbar/Navbar";
import Sidebar from "../../core/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import logger from "../../../logic/Logger/logger";
import ConfirmationModalProvider from "../../core/modal/ModalConfirmation";

export default function MainLayout({ }) {

   logger.log("Renderizo MainLayout")

   return (
      <>

         <ConfirmationModalProvider>
            <div className='flex h-screen overflow-hidden transition-all'>
               <Sidebar />
               <div className='w-full h-full overflow-hidden'>
                  <Navbar />
                  <div id="step-page-modal" className="relative w-full h-screen overflow-hidden">
                     <main className='w-full h-full overflow-hidden'>
                        <div className="h-full mx-auto p-4 mt-4  overflow-y-auto">
                           <Outlet />

                        </div>
                     </main>
                  </div>
               </div>
            </div>
            <div id="modal-root"></div>
         </ConfirmationModalProvider>
         <ToastContainer
            style={{ width: "420px" }}
            position="top-center"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            draggable={true}
            pauseOnHover={true}
            theme="light"
            icon={false}
         ></ToastContainer>


      </>
   )
}