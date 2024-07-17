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
import StationPage from "./ui/components/Stations/StationPage";
import HealthcareCenterPage from "./ui/components/HealthcareCenter/HealthcareCenterPage";
import ConfigContextProvider from "./logic/Config/ConfigContext";
import LoginPage from "./ui/components/Authentication/LoginPage";
import AuthProvider from "./ui/components/Authentication/AuthProvider";
import RolesPages from "./ui/components/Roles/RolesPages.jsx";

import MissionPage from './ui/components/Mission/MissionPage.tsx'


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
            element: <ComingSoonPage />
         },
         {
            path: "assist/",
            element: <HealthcareCenterPage />
         },
         {
            path: "missions/",
            element: <MissionPage />
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
