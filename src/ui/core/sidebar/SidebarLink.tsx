
import React, { MouseEventHandler, ReactNode } from 'react'
import { NavLink } from 'react-router-dom';



interface SideBarLinkProps {
    icon: ReactNode,
    name?: string,
    link?: string,
    onClick?: MouseEventHandler<HTMLAnchorElement> | undefined,
    collpase?: boolean,

}


export default function SideBarLink({ icon = null, name = "", link = "", onClick, collpase = false }: SideBarLinkProps) {
    return (
        <div>
            <NavLink to={link} onClick={onClick}>
                {({ isActive }) => (
                    <div className={`relative outline-none flex justify-center md:justify-between items-center   
                    ${isActive ? "md:bg-[#2286DD]" : ""}  md:hover:bg-[#2286DD] bg-opacity-80 rounded-xl shadow-sm cursor-pointer `}>

                        <div className={`relative ${isActive ? "bg-[#2286DD] " : ""} hover:bg-[#2286DD] 
                        flex md:space-x-2 text-md justify-center  items-center py-2.5 px-3 rounded-xl`}>
                            <div className='h-[34px] w-[34px] '>
                                {icon}
                            </div>

                            <h3 className={`${collpase ? "" : "md:opacity-100 md:left-12"} absolute left-0 text-lg text-[whitesmoke] transition-all ease-in-out 
                                duration-500 opacity-0 `}>{name}</h3>
                        </div>
                    </div>
                )}
            </NavLink>
        </div>
    )

}