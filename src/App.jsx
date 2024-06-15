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
import { ToastContainer } from "react-toastify";




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
            element: <ComingSoonPage />
         },
         {
            path: "units/",
            element: <ComingSoonPage />
         },
         {
            path: "locations/",
            element: <ComingSoonPage />
         },
         {
            path: "assist/",
            element: <ComingSoonPage />
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
   return (
      <>
         <RouterProvider router={router} />
      </>
   )

}

export default App
