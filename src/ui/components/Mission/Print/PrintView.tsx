import React, { ReactNode } from "react"

interface PrintViewProps {
    children: ReactNode
}

export function PrintView({ children }: PrintViewProps) {
    return <div className="h-10 flex-1 p-8">
        <div className="max-h-full w-full justify-center overflow-y-auto rounded-lg border border-slate-400 bg-slate-300 px-12 py-4">
            <div className="h-screen w-full bg-white">
                {children}
            </div>
        </div>
    </div>

}