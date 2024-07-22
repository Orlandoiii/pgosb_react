import React from "react"
import ShieldLogoImg from "../../../assets/logo-3.png"


interface ShieldLogoProps {
    width?: string
    height?: string
    textColor?: string
    space?: string
}

export default function ShieldLogo({ width = "w-[40px]", height = "h-[40px]",
    textColor = "text-black", space = "" }: ShieldLogoProps) {
    return (
        <div className={`flex justify-center items-center w-full h-auto ${space}`}>
            <div className={`${width} ${height}`}>
                <img className='m-0 p-0' src={ShieldLogoImg} alt='fire figther logo shield'></img>
            </div>

            <h1 className={`text-4xl ${textColor}`}>PGOSB</h1>
        </div>
    )
}