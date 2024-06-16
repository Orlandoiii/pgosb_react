import { useRouteError } from "react-router-dom";
import logger from "../../../logic/Logger/logger";

export default function ErrorPage({ }) {
    const error = useRouteError();


    logger.error("Renderizando ErrorPage:", error);

    return (
        <div className={`h-screen w-full error_background`}>
            <div className=" w-full h-full flex justify-center items-center">
                <div className="bg-[whitesmoke] text-center p-20 rounded-md  bg-opacity-[0.7]">
                    <h1 className="mb-4 text-6xl font-semibold text-rose-500">Oohh!!!</h1>

                    <p className="mb-4 text-3xl text-black">Oops! Parece que tenemos un error.</p>
                    <p className="text-2xl text-rose-500">{error?.statusText || error?.message}</p>
                    <div className="my-6 animate-bounce">
                        <svg className="mx-auto h-20 w-20 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                    </div>
                    <a href="/" className="text-2xl bg-emerald-600 px-4 py-2 rounded-md text-white">Regresar</a>
                </div>
            </div>
        </div>

    )
}