import { motion } from "framer-motion"
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import logger from "../../../logic/Logger/logger";

const backDropAnimation = {

    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    },
    exit: {
        opacity: 0
    }
}

export default function Backdrop({ children, outRef, backGround = "bg-white/60" }) {

    logger.log("Renderizo Backdrop ");

    // const [parenNode, setParentNode] = useState(null);

    // useEffect(() => {
    //     const node = document.querySelector("#backdrop-root");
    //     setParentNode(node)
    // }, [])


    return (
        <>
            <motion.div
                variants={backDropAnimation}
                initial={"hidden"}
                animate={"visible"}
                exit={"exit"}
                id="Backdrop"
                ref={outRef}
                className={`fixed inset-0 ${backGround} h-full w-full overflow-hidden overscroll-none z-40 
                    flex justify-center items-center`}>
                {children}
            </motion.div>
        </>
    )
}