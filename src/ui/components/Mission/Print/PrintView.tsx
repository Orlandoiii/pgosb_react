import React, { ReactNode } from "react"
import ModalLayout from "../../../core/layouts/modal_layout"

interface PrintViewProps {
    children: ReactNode
}

export function PrintView({ children }: PrintViewProps) {
    return <div className="h-full w-full justify-center bg-slate-300 px-8 py-4">
        <iframe id="printIFrame" style={{ display: "none" }}></iframe>

        <div className="min-h-full min-w-[60rem] w-full bg-white p-8">
            {children}
        </div>
    </div>
}
