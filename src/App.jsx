import {
   createBrowserRouter,
   RouterProvider,
} from "react-router-dom";

import MainLayout from "./ui/components/Layouts/MainLayout"
import NotFound from "./ui/core/errors/NotFound"
import ErrorPage from "./ui/core/errors/ErrorPage";
import Testing from "./ui/practice/Testing";
import UserPage from "./ui/components/Users/UserPage";
import ComingSoonPage from "./ui/core/errors/ComingSoonPage";
import LoginPage from "./ui/components/Authentication/LoginPage";
import UnitPage from "./ui/components/Units/UnitPage";
import logger from "./logic/Logger/logger.js";
import StationPage from "./ui/components/Stations/StationPage.jsx";
import LocationPage from "./ui/components/Locations/LocationPage.jsx";
import { useState } from "react";
import LoadingModal from "./ui/core/modal/LoadingModal.jsx";
import HealthcareCenterPage from "./ui/components/HealthcareCenter/HealthcareCenterPage.jsx";
import DragBoxComponent from "./ui/practice/DragBox.jsx";




const router = createBrowserRouter([
   {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
         {
            path: "users/",
            element: <UserPage />
         },
         {
            path: "services/",
            element: <ComingSoonPage />
         },
         {
            path: "roles/",
            element: <ComingSoonPage />
         },
         {
            path: "stations/",
            element: <StationPage />
         },
         {
            path: "units/",
            element: <UnitPage />
         },
         {
            path: "locations/",
            element: <LocationPage />
         },
         {
            path: "assist/",
            element: <HealthcareCenterPage />
         },
         {
            path: "test/",
            element: <Testing />
         }

      ]

   },

   {
      path: "dragbox",
      element: <DragBoxComponent />
   },
   // {
   //    path: "/login",
   //    element: <LoginPage />,
   //    errorElement: <ErrorPage />,
   // },
   {
      path: "*",
      element: <NotFound />
   }
]);

function App() {

   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [openLoadModal, setOpenLoadModal] = useState(false);



   return (
      <>

         {!isAuthenticated && <LoginPage openLoadModal={openLoadModal} onAuthenticated={() => {
            setOpenLoadModal(true);
            setTimeout(() => {
               setOpenLoadModal(false);
               setIsAuthenticated(true)
            }, 2000)

         }} />}
         {isAuthenticated && <RouterProvider router={router} />}

         <LoadingModal open={openLoadModal}></LoadingModal>
      </>
   )

}

export default App
