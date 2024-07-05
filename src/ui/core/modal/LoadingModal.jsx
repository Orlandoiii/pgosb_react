import { createContext, useContext, useState } from "react";
import LinearDots from "../icons/LinearDots"
import logger from "../../../logic/Logger/logger";
import { motion, AnimatePresence } from "framer-motion";
import Backdrop from "./Backdrop";

export function LoadingModal({ open }) {

    logger.log("Renderizo LoadModal", open)
    return (

        <AnimatePresence>
            {open &&
                <Backdrop>
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        className={`
               flex justify-center items-center  
               min-h-[320px] min-w-[320px] md:min-h-[380px]  md:min-w-[460px]`}
                    >
                        <LinearDots height={"100"} />
                    </motion.div>

                </Backdrop>
            }
        </AnimatePresence>
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
            <LoadingModal open={open} />
        </LoadingModalContext.Provider>
    )
}

