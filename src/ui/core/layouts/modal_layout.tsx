import React, { ReactNode } from 'react'
import { CloseXSimbol } from '../modal/ModalContainer'

interface ModalLayoutProps {
    className?: string
    title: string
    children?: ReactNode
    onClose?: () => void
}

function ModalLayout({
    className,
    title,
    children,
    onClose,
}: ModalLayoutProps) {
    return (
        <div
            className={`${className} flex flex-col relative rounded-xl bg-slate-100 shadow-lg shadow-gray-400 overflow-hidden`}
        >
            <CloseXSimbol onClose={onClose} />
            <h2 className="w-full bg-[#0A2F4E] flex justify-center items-center text-[whitesmoke] text-lg h-11 p-2 shadow-lg">
                {title}
            </h2>
            <div className="w-full h-full p-5 verflow-y-auto">{children}</div>
            <span className="h-0 md:block md:bg-[#0A2F4E] md:h-[7px] md:w-full md:shadow-md "></span>
        </div>
    )
}

export default ModalLayout
