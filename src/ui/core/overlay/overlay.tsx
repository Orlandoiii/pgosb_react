import { AnimatePresence, motion } from 'framer-motion'
import React, { ReactElement, ReactNode } from 'react'

import { OverlayContext } from './overlay_context'
import { isFunction } from '@tanstack/react-table'

export type AnimationType = 'Bounce' | 'FadeIn'
export type OverlayType = 'Modal' | 'Loader'

interface OverlayProps {
    type?: OverlayType
    animation?: AnimationType
    background?: string
    closeOnClickOut?: boolean
    onClosed?: () => void
    children?: ReactNode | (() => ReactElement)
    isVisible: boolean
    closeOverlay: () => void
}

function Overlay({
    type = 'Modal',
    animation = 'Bounce',
    background = 'bg-black bg-opacity-30',
    closeOnClickOut = false,
    children,
    onClosed,
    isVisible,
    closeOverlay,
}: OverlayProps) {
    async function clickOutside(e: React.MouseEvent) {
        if (e.target === e.currentTarget && closeOnClickOut) closeOverlay()
    }
    return (
        <OverlayContext.Provider value={{ closeOverlay }}>
            <AnimatePresence onExitComplete={onClosed}>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        onClick={clickOutside}
                        aria-modal="true"
                        className={`z-10 absolute top-0 left-0 h-full w-full ${background}`}
                    >
                        {type === 'Modal' && animation === 'Bounce' && (
                            <motion.div
                                initial={{ scale: 0.7 }}
                                animate={{ scale: [0.9, 1.05, 0.98, 1] }}
                                transition={{
                                    duration: 0.2,
                                    ease: 'easeInOut',
                                }}
                                className="relative h-full w-full flex items-center justify-center pointer-events-none"
                            >
                                <div className=" pointer-events-auto">
                                    {isFunction(children)
                                        ? children()
                                        : children}
                                </div>
                            </motion.div>
                        )}
                        {type === 'Modal' && animation === 'FadeIn' && (
                            <motion.div className="relative h-full w-full flex items-center justify-center pointer-events-none">
                                <div className=" pointer-events-auto">
                                    {isFunction(children)
                                        ? children()
                                        : children}
                                </div>
                            </motion.div>
                        )}

                        {type === 'Loader' && (
                            <div className="animate-pulse">
                                <svg
                                    className="w-32 fill-gray-600 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 80 80"
                                >
                                    <path d="M17.94,17.94C12.29,23.58,8.8,31.39,8.8,40s3.5,16.42,9.14,22.06l-6.22,6.22C4.48,61.05,0,51.05,0,40c0-11.05,4.48-21.05,11.71-28.28L17.94,17.94z" />
                                    <path d="M80,40c0,11.05-4.48,21.05-11.72,28.28l-6.22-6.22c5.65-5.64,9.14-13.45,9.14-22.06s-3.49-16.42-9.14-22.06l6.22-6.22C75.52,18.95,80,28.96,80,40z" />
                                </svg>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </OverlayContext.Provider>
    )
}

export default React.memo(Overlay)
