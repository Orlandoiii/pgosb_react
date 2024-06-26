import { ToastContainer } from "react-toastify";
import Navbar from "../../core/navbar/Navbar";
import Sidebar from "../../core/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import logger from "../../../logic/Logger/logger";

export default function MainLayout({ }) {


   const [openPage, setOpenPage] = useState(false);

   logger.log("Renderizo MainLayout")


   return (
      <>
         <div className='flex h-screen overflow-hidden'>
            <Sidebar />
            <div className='w-full h-full overflow-hidden'>
               <Navbar onBellIconClik={() => { setOpenPage(o => !o) }} />
               <div className="relative w-full h-screen overflow-hidden">
                  <main className='w-full h-full overflow-hidden'>
                     <div className="h-full mx-auto p-4 mt-4  overflow-y-auto">
                        <Outlet />
                     </div>
                  </main>

                  <div className={`absolute top-0 left-0 transition-all ease-in-out duration-700 
                   ${openPage ? "translate-x-0" : "translate-x-[100%]"}  h-full w-full bg-slate-400`}>

                  </div>

               </div>
            </div>
         </div>
         <div id="modal-root"></div>

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