import React from "react"


interface FormTitleProps {
    title: string | undefined
}

export default function FormTitle({ title }: FormTitleProps) {
    return (
        <h2 className="text-md text-center mb-4 p-0.5 
        bg-[#0A2F4E] text-[whitesmoke] rounded-md shadow-md">{title}</h2>)
}