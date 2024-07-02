import { motion, AnimatePresence } from "framer-motion"
import logger from "../../../logic/Logger/logger";

const scaleAnimationBackDrop = {
    initial: { opacity: 0, rotation: 0.02 },
    animate: { opacity: 1, rotation: 0.02 },
    exit: { opacity: 0, rotation: 0.02 },

}

const scaleAnimation = {
    initial: { opacity: 0, rotation: 0.02, scale: 1.5 },
    animate: { opacity: 1, rotation: 0.02, scale: 1.0 },
    exit: { opacity: 0, rotation: 0.02, scale: 1.2 },
    transition: { ease: "easeInOut" }
}

export function CloseXSimbol({ onClose }) {
    return (
        <button className='w-7 bg-rose-700 rounded-full p-2 
        absolute z-10 top-2 right-4 shadow-md swadow-slate-500 focus:outline-none '
            onClick={(e) => {
                e.stopPropagation();
                if (onClose) onClose(e);
            }}>
            <div className="flex w-full justify-end">
                <div className="fill-secundary w-8">

                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.7 20.1C5.20294 20.5971 4.39706 20.5971 3.9 20.1C3.40294 19.6029 3.40294 18.7971 3.9 18.3L10.2 12L3.9 5.7C3.40294 5.20294 3.40294 4.39706 3.9 3.9C4.39706 3.40294 5.20294 3.40294 5.7 3.9L12 10.2L18.3 3.9C18.7971 3.40294 19.6029 3.40294 20.1 3.9C20.5971 4.39706 20.5971 5.20294 20.1 5.7L13.8 12L20.1 18.3C20.5971 18.7971 20.5971 19.6029 20.1 20.1C19.6029 20.5971 18.7971 20.5971 18.3 20.1L12 13.8L5.7 20.1Z" fill="#FFFFFF">
                        </path>
                    </svg>
                </div>
            </div>
        </button>
    )
}


export default function ModalContainer({ show, onClose, showX = true, children = null, title = "", downStikyChildren }) {

    logger.log("Renderizo Modal Container")

    return (
        <AnimatePresence
            initial={false}
            mode='wait'
            onExitComplete={() => null}

        >
            {show &&
                <motion.div
                    variants={scaleAnimationBackDrop}
                    initial={"initial"}
                    animate={"animate"}
                    exit={"exit"}
                    className={`fixed left-0 top-0 w-full h-full 
        flex items-center justify-center 
           bg-black/20 z-10 overflow-hidden`}>

                    <motion.div
                        variants={scaleAnimation}
                        initial={"initial"}
                        animate={"animate"}
                        exit={"exit"}
                        transition={"transition"}

                        className="relative w-full h-full md:w-auto  md:h-auto  rounded-xl  
        bg-slate-100 shadow-lg shadow-gray-400 ">

                        {showX && <CloseXSimbol onClose={onClose} />}

                        {title && title.length > 0 && <h2 className='relative w-full bg-[#0A2F4E] rounded-t-xl flex justify-center items-center
            text-[whitesmoke] text-lg h-11 p-2 shadow-lg'>{title}</h2>}

                        <div className='w-full h-full  p-5 min-w-[360px]  min-h-[220px] bg-slate-100 max-h-[820px] overflow-y-auto'>
                            {children}
                        </div>

                        <div className="absolute">
                            {downStikyChildren}
                        </div>

                        <span className='h-0 md:block md:bg-[#0A2F4E] md:h-[7px] md:w-full md:shadow-md '></span>

                    </motion.div>
                </motion.div >}
        </AnimatePresence>
    )

}