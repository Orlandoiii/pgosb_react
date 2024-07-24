import React, { PropsWithChildren } from 'react'
import { createContext, useContext, useState } from 'react'
import LinearDots from '../icons/LinearDots'
import logger from '../../../logic/Logger/logger'
import { motion, AnimatePresence } from 'framer-motion'
import Backdrop from './Backdrop'


interface LoadingModalProps {
    open: boolean
}


export function LoadingModal({ open }: LoadingModalProps) {
    logger.log('Renderizo LoadModal', open)
    return (
        <AnimatePresence initial={false} onExitComplete={() => null}>
            {open && (
                <Backdrop>
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        className={`
               flex justify-center items-center  
               min-h-[320px] min-w-[320px] md:min-h-[380px]  md:min-w-[460px]`}
                    >
                        <LinearDots height={100} />
                    </motion.div>
                </Backdrop>
            )}
        </AnimatePresence>
    )
}

const LoadingModalContext = createContext({
    openLoadModal: () => { },
    closeLoadModal: () => { },
})

export function useLoadModal() {
    return useContext(LoadingModalContext)
}



interface LoadModalContextProps {
    initOpen: boolean,
}


export default function LoadModalContextProvider({ initOpen,
    children }: PropsWithChildren<LoadModalContextProps>) {

    const [open, setOpen] = useState(initOpen)

    function openLoadModal() {
        setOpen(true)
    }

    function closeLoadModal() {
        setOpen(false)
    }

    return (
        <LoadingModalContext.Provider
            value={{
                openLoadModal: openLoadModal,
                closeLoadModal: closeLoadModal,
            }}
        >
            {children}
            <LoadingModal open={open} />
        </LoadingModalContext.Provider>
    )
}
