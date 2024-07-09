import { useNavigate } from "react-router-dom";
import logger from "../../../logic/Logger/logger"
import { useAuth } from "./AuthProvider";
import LoginForm from "./Forms/LoginForm"
import { useEffect, useReducer, useState } from "react";
import { LoadingModal } from "../../core/modal/LoadingModal";
import { NotificationModal, useNotificationAlert } from "../../core/alerts/NotificationModal";


const notificationInitialState = {
    open: false,
    message: "",
    type: "info",
    title: "",
}

function notificationReducer(state, action) {

    switch (action.type) {
        case "notification/open":
            return {
                ...state,
                open: true,
                title: action.payload.title,
                message: action.payload.message,
                type: action.payload.type

            }
        case "notification/close":
            return {
                ...state,
                open: false,
            }
    }


    return state;
}


export default function LoginPage({ }) {


    logger.log("Renderizando LoginPage");


    const { state, login } = useAuth();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [notificationState, dispatch] = useReducer(notificationReducer, notificationInitialState);

    function handleSubmit(data) {
        setLoading(true);
        login(data)
            .catch(err => {
                logger.error(err);
                dispatch({
                    type: "notification/open",
                    payload: {
                        type: "error",
                        title: "Oohh Error!!!",
                        message: "Lo sentimos tenemos problemas para realizar el login"
                    }
                })

            }).finally(() => {
                setLoading(false);
            })
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
            <LoadingModal open={loading} />
            <NotificationModal
                show={notificationState.open}
                onClose={() => dispatch({ type: "notification/close" })}
                type={notificationState.type}
                title={notificationState.title}
                message={notificationState.message}
            />

        </>
    )

}