import ToggleColorTheme from "../buttons/ToggleColorTheme";
import BellIcon from "../icons/BellIcon";
import LetterIcon from "../icons/LetterIcon";
import ThinArrowIcon from "../icons/ThinArrowIcon";
import FiremanImg from '../../../assets/fireman.png'
import FireLogo from "../logo/FireLogo";




export default function Navbar({ onBellIconClik }) {
    return (

        <nav className='sticky top-0 flex w-full h-[80px] 
        bg-[whitesmoke] shadow-lg rounded-sm p-0.5 '>

            <div className='w-full h-full max-w-[1600px] mx-auto flex items-center justify-end  px-2  md:px-4'>

                {/* <div className="flex justify-center items-center space-x-1">
                    <FireLogo width="w-[35px]" height="h-[35px]" bgColor=""/> 
                    <h3 className="hidden md:block uppercase text-rose-700 text-lg font-medium">pgosb</h3>
                </div> */}

                <div className="pr-6">
                    <div className='flex items-center space-x-3'>
{/* 
                        <div>
                            <ToggleColorTheme />
                        </div> */}

                        <div onClick={onBellIconClik} className="p-2 w-[34px] h-[34px] rounded-full bg-slate-200 flex justify-center items-center">
                            <BellIcon />
                        </div>

                        <div className="p-2 w-[34px] h-[34px] rounded-full bg-slate-200 flex justify-center items-center">
                            <LetterIcon />
                        </div>

                        <div className='hidden space-y-0.5 lg:flex flex-col justify-center items-end'>
                            <h3 className='text-sm font-semibold self-start text-rose-700'>Pedro Perez</h3>
                            <p className='text-xs text-slate-500'>Asistente Bombero</p>
                        </div>

                        <div className='rounded-full w-[50px] h-[48px] flex justify-center items-center
                                          bg-gradient-to-r from-gray-400 to-slate-300 shadow-lg'>
                            <img className='w-[35px] h-[35px] ' src={FiremanImg} alt="Bombero logo" />
                        </div>

                        <button>
                            <ThinArrowIcon />
                        </button>


                    </div>
                </div>


            </div>

        </nav>
    )
}