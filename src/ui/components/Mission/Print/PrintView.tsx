import React, { ReactNode } from "react"
import ModalLayout from "../../../core/layouts/modal_layout"

interface PrintViewProps {
    children: ReactNode,
    closeOverlay?: () => void
}

export function PrintView({ children, closeOverlay }: PrintViewProps) {
    return <ModalLayout
        className="max-w-[85vw] max-h-[90vh] overflow-y-auto"
        title={'Registro de Persona'}
        onClose={closeOverlay}
    ><div className="h-[80vh] w-[80vw] flex flex-col">

            <div className="h-10 flex-1 p-8">
                <div className="max-h-full w-full justify-center overflow-y-auto rounded-lg border border-slate-400 bg-slate-300 px-12 py-4">
                    <div className="min-h-[50rem] w-full bg-white">
                        {children}
                    </div>
                </div>
            </div>
        </div>

    </ModalLayout>


}