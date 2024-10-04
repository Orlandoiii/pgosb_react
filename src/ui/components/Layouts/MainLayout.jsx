import { ToastContainer } from "react-toastify";
import { Outlet, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import logger from "../../../logic/Logger/logger";
import ConfirmationModalProvider from "../../core/modal/ModalConfirmation";
import { useEffect } from "react";
import { useAuth } from "../Authentication/AuthProvider";
import UserDataProvider from "../../core/context/UserDataContext";
import Sidebar from "../../core/sidebar/Sidebar";
import Navbar from "../../core/navbar/Navbar";


import BomberoNacionalLogo from '../../../assets/images/BoomberoNacional.png';


export default function MainLayout({ }) {

   logger.log("Renderizo MainLayout")


   const { state } = useAuth();

   const navigate = useNavigate();


   useEffect(() => {
      if (!state.isAuthenticated)
         navigate("/login");
   }, [state.isAuthenticated])


   return (
      <>


         <ConfirmationModalProvider>
            <UserDataProvider>
               {state.isAuthenticated && <div className='flex h-screen overflow-hidden transition-all '>
                  <Sidebar />



                  <div className='w-full h-full overflow-hidden'>
                     <Navbar />

                     <div id="step-page-modal" className="relative w-full h-screen overflow-hidden">
                        <main className='w-full h-full overflow-hidden'>
                          
                           <div className="relative h-full mx-auto p-4 mt-4  overflow-y-auto ">

                              <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[-1] flex items-center justify-center">
                                 <div className="w-full h-full flex flex-col  items-center justify-start pt-20">
                                    <div className="w-full h-[600px] logo_bombero_nacional opacity-80 blur-[1px]">
                                    </div>
                                 </div>
                              
                                 <h2 className="absolute bottom-[120px] left-10 text-2xl  text-center text-black font-light">Bienvenidos a GRES</h2>
                                 <h2 className="absolute bottom-[120px] right-10 text-xl font-medium text-center text-black">Version 1.0.2</h2>

                              </div>
                            
                              <Outlet />

                           </div>
                        </main>
                     </div>
                  </div>

               </div>
               }
            </UserDataProvider>
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