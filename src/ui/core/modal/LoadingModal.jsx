import { createContext, useContext, useState } from "react";
import LinearDots from "../icons/LinearDots"
import logger from "../../../logic/Logger/logger";

function LoadingModalInternal({ open }) {

    logger.log("Renderizo LoadModal", open)
    return (

        <div className={`fixed  w-full h-full z-10 inset-0 flex justify-center items-center transition-colors
        ${open ? "visible bg-white/50" : "invisible"}`}
        >


            <div
                onClick={(e) => e.stopPropagation()}
                className={`
               flex justify-center items-center transition-all  min-h-[320px] min-w-[320px] md:min-h-[380px]  md:min-w-[460px]
              ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
            `}
            >
                <LinearDots height={"100"} />
            </div>



        </div>
    )

}
const LoadingModalContext = createContext(
    {
        openLoadModal: () => { },
        closeLoadModal: () => { },
    }
);

export function useLoadModal() {
    return useContext(LoadingModalContext);
}


export default function LoadModalContextProvider({ children }) {

    const [open, setOpen] = useState(false);

    function openLoadModal() {
        setOpen(true);
    }

    function closeLoadModal() {
        setOpen(false);
    }

    return (
        <LoadingModalContext.Provider value={
            { openLoadModal: openLoadModal, closeLoadModal: closeLoadModal }
        }>
            {children}
            <LoadingModalInternal open={open} />
        </LoadingModalContext.Provider>
    )
}

