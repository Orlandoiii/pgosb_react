import React from 'react'
import logger from "../../../logic/Logger/logger";
import { useUser } from '../context/UserDataContext';

import FiremanImg from '../../../assets/fireman.png' ;


export default function Navbar({ }) {
    logger.log("Renderizo Navbar")

    const { userData, userRolData, userDataIsLoad } = useUser();


    const name = userDataIsLoad ? `${userData?.first_name} ${userData?.last_name}` : "";


    const roleName = userDataIsLoad ? userRolData?.role_name : ""


    return (
        <>
            <nav className='sticky  top-0 flex w-full h-[80px] 
        bg-[white] shadow-sm rounded-sm  z-10'>



                <div className=' w-full h-full max-w-[1920px] mx-auto 
                flex items-center justify-end  px-2  md:px-4 '>



                    <div className="pr-12">


                        <div className='flex items-center space-x-3'>


                            {/* <div className="p-2 w-[34px] h-[34px] rounded-full bg-slate-200 flex justify-center items-center">
                                <BellIcon />
                            </div>

                            <div className="p-2 w-[34px] h-[34px] rounded-full bg-slate-200 flex justify-center items-center">
                                <LetterIcon />
                            </div> */}



                            <div className={`flex flex-col justify-center items-end transition-all ease-in-out duration-500 
                                ${userDataIsLoad ? " opacity-100 translate-x-0" : " opacity-0 -translate-x-10"}`}>
                                <h3 className='text-lg font-semibold self-start text-rose-700'>{name}</h3>
                                <p className='text-md text-slate-500'>{roleName}</p>
                            </div>

                            <div className={` rounded-full w-[60px] h-[60px] flex justify-center items-center
                                          bg-gradient-to-r from-gray-400 to-slate-300 shadow-lg 
                                          transition-all ease-in-out duration-500
                                          ${userDataIsLoad ? " opacity-100 scale-100" : " opacity-0 scale-75"}
                                          `}>
                                <img className='w-[35px] h-[35px] ' src={FiremanImg} alt="Bombero logo" />
                            </div>

                        </div>

                    </div>

                </div>


            </nav>

        </>

    )
}