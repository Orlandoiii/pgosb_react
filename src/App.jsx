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
            element: <ComingSoonPage />
         },
         {
            path: "assist/",
            element: <ComingSoonPage />
         },
         {
            path: "test/",
            element: <Testing />
         }

      ]

   },
   {
      path: "/login",
      element: <LoginPage />,
      errorElement: <ErrorPage />,
   },
   {
      path: "*",
      element: <NotFound />
   }
]);

function App() {
   logger.log("Renderizo App");
   
   return (
      <>
         <RouterProvider router={router} />
      </>
   )

}

export default App
