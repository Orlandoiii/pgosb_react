import React, { ReactNode } from 'react'

import { CloseXSimbol } from '../../../core/modal/ModalContainer'
import { Modal, ModalProps } from './modal'


interface ModalLayoutProps extends ModalProps {
    className?: string
    title: string
    children?: ReactNode
    isVisible: boolean
    onClose?: () => void
    onClosed?: () => void
}

function ModalLayout({
    className,
    title,
    children,
    onClose,
    ...rest
}: ModalLayoutProps) {
    return (
        <Modal {...rest}>
            <div className='h-screen w-[100vw] flex flex-col items-center py-20 overflow-y-auto'>
                <div className={`${className} flex flex-col relative rounded-xl bg-slate-100 shadow-lg shadow-gray-400 pointer-events-auto`}>
                    <CloseXSimbol onClose={onClose} />
                    <h2 className="w-full bg-[#0A2F4E] flex justify-center items-center rounded-t-xl text-[whitesmoke] text-lg h-11 p-2 shadow-lg">
                        {title}
                    </h2>
                    <div className="w-full h-full p-5 verflow-y-auto">{children}</div>
                    <span className="h-0 md:block md:bg-[#0A2F4E] md:h-[7px] md:w-full md:shadow-md "></span>
                </div>
            </div>
        </Modal>
    )
}

export default ModalLayout
