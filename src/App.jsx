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
import UnitPage from "./ui/components/Units/UnitPage";
import logger from "./logic/Logger/logger.js";
import StationPage from "./ui/components/Stations/StationPage.jsx";
import LocationPage from "./ui/components/Locations/LocationPage.jsx";
import HealthcareCenterPage from "./ui/components/HealthcareCenter/HealthcareCenterPage.jsx";
import ConfigContextProvider from "./logic/Config/ConfigContext.jsx";
import LoginPage from "./ui/components/Authentication/LoginPage.jsx";
import AuthProvider from "./ui/components/Authentication/AuthProvider.jsx";
import RolesPages from "./ui/components/Roles/RolesPages.jsx";




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
            element: <RolesPages />
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
      path: "error",
      element: <ErrorPage />
   },
   {
      path: "login",
      element: <LoginPage />,
      errorElement: <ErrorPage />
   },
   {
      path: "*",
      element: <NotFound />,
      errorElement: <ErrorPage />
   }
]);

function App() {

   logger.log("Renderizo App")

   return (
      <>

         <ConfigContextProvider>
            <AuthProvider>
               <RouterProvider router={router} />
            </AuthProvider>
         </ConfigContextProvider >

      </>
   )

}

export default App
