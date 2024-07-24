import React from 'react'
import FireLogoImg from "../../../assets/logo_pgosb_fire.png"

interface FireLogoProps {
    width?: string
    height?: string
    bgColor?: string
}


export default function FireLogo({ width = "w-[45px]", height = "h-[45px]",
    bgColor = "bg-[whitesmoke]" }: FireLogoProps) {
    return (
        <div className={`${width} ${height}  rounded-full ${bgColor}`}>
            <img className='m-0 p-0' src={FireLogoImg} alt='fire figther logo'></img>
        </div>
    )
}