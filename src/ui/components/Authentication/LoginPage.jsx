import { useNavigate } from "react-router-dom";
import logger from "../../../logic/Logger/logger"
import { useAuth } from "./AuthProvider";
import LoginForm from "./Forms/LoginForm"
import { useEffect } from "react";


export default function LoginPage({ }) {


    logger.log("Renderizando LoginPage");


    const { state, login } = useAuth();

    const navigate = useNavigate();
    function handleSubmit(data) {
        login(data)
    }

    useEffect(() => {

        if (state.isAuthenticated) {
            navigate("/");
        }
    }, [state.isAuthenticated])
    return (
        <>
            {!state.isAuthenticated && <div className="h-screen w-full bg-gray-200 flex flex-col justify-center login-bg">
                <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                    <div
                        className=" sm:absolute inset-0 bg-gradient-to-r from-[#0A2F4E] to-[#3C50E0]
            shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-xl z-0">
                    </div>
                    <LoginForm onSubmit={handleSubmit} />
                </div>
            </div>}
        </>
    )

}