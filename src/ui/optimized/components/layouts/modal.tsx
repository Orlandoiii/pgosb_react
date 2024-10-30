import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type OverlayType = "Modal" | "Drawer" | "Loader";
type AnimationType = "Bounce" | "FadeIn" | "None";
type Position =
    "Top-Left"
    | "Top"
    | "Top-Right"
    | "Center-Left"
    | "Center"
    | "Center-Right"
    | "Bottom-Left"
    | "Bottom"
    | "Bottom-Right";

export interface ModalProps {
    type?: OverlayType;
    animation?: AnimationType;
    position?: Position;
    children?: React.ReactNode;
    className?: string;
    background?: string;
    isVisible: boolean;
    onClickedOut?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onClosed?: () => void;
}

export function Modal({ type = 'Modal', animation = 'Bounce', position = 'Center', className = '', background = 'bg-black bg-opacity-30', ...rest }: ModalProps) {
    const [mounted, setMounted] = useState(rest.isVisible);

    useEffect(() => {
        if (rest.isVisible) setMounted(true)
    }, [rest.isVisible])

    return mounted ?
        (ReactDOM.createPortal(
            <AnimatePresence onExitComplete={() => {
                setMounted(false)
                rest.onClosed?.()
            }}>
                {rest.isVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: animation === "None" ? 0 : 0.12 }}
                        onClick={rest.onClickedOut}
                        aria-modal="true"
                        role="dialog"
                        className={`z-50 absolute top-0 left-0 h-full w-full ${background} pointer-events-auto`}
                    >
                        <motion.div
                            {...animationVariants[animation]}
                            className={`${className} ${positionClass(position)} relative h-full w-full flex pointer-events-none`}
                        >
                            <div className="pointer-events-auto"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }}>
                                {rest.children}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>,
            document.getElementById("modal-container")!
        )) :
        (<></>)
}

const animationVariants = {
    Bounce: {
        initial: { scale: 0.7 },
        animate: { scale: [1, 1.2, 0.9, 1] },
        transition: { duration: 0.2, ease: "easeInOut" },
    },
    FadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
    },
    None: {
        initial: {},
        animate: {},
        exit: {},
        transition: { duration: 0 },
    },
};

function positionClass(position: Position): string {
    const verticalPosition = position.includes("Top") ? "items-start" : position.includes("Bottom") ? "items-end" : "items-center";
    const horizontalPosition = position.includes("Left") ? "justify-start" : position.includes("Right") ? "justify-end" : "justify-center";
    return `${verticalPosition} ${horizontalPosition}`;
}