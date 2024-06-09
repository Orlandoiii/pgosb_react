import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import MainLayout from './ui/components/Layouts/MainLayout.jsx';
import NotFound from './ui/core/errors/NotFound.jsx';
import LoginForm from './ui/components/Authentication/LoginForm.jsx';





const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFound />,
        // children: [
        //     {
        //         path: "users/",
        //         element: <LoginForm />
        //     }
        // ]

    },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
