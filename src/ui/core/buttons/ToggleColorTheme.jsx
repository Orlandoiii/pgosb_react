import { useEffect, useState } from "react"

function SunIcon({ }) {
    return (

        <div className="w-[25px] h-[25px] rounded-full bg-[whitesmoke]">
            <svg enableBackground="new 0 0 512 512" version="1.1" viewBox="0 0 512 512" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink">
                <g>
                    <g>
                        <path d="M256,144c-61.75,0-112,50.25-112,112c0,61.749,50.25,112,112,112s112-50.251,112-112    
                    C368,194.25,317.75,144,256,144z M256,112c8.833,0,16-7.146,16-16V64c0-8.833-7.167-16-16-16c-8.854,0-16,7.167-16,16v32    
                    C240,104.854,247.146,112,256,112z M256,400c-8.854,0-16,7.167-16,16v32c0,8.854,7.146,16,16,16c8.833,0,16-7.146,16-16v-32    
                    C272,407.167,264.833,400,256,400z M380.417,154.167l22.625-22.625c6.25-6.25,6.25-16.375,0-22.625    
                    c-6.251-6.25-16.375-6.25-22.625,0l-22.625,22.625c-6.251,6.25-6.251,16.375,0,22.625    
                    C364.042,160.416,374.166,160.416,380.417,154.167z M131.541,357.854l-22.623,22.625c-6.252,6.25-6.252,16.377,0,22.625    
                    c6.249,6.25,16.373,6.25,22.623,0l22.625-22.625c6.251-6.291,6.251-16.375,0-22.625    
                    C147.917,351.604,137.792,351.562,131.541,357.854z M112,256c0-8.833-7.167-16-16-16H64c-8.854,0-16,7.167-16,16    
                    c0,8.854,7.146,16,16,16h32C104.833,272,112,264.854,112,256z M448,240h-32c-8.854,0-16,7.167-16,16c0,8.854,7.146,16,16,16h32    
                    c8.833,0,16-7.146,16-16C464,247.167,456.833,240,448,240z M131.521,154.167c6.249,6.25,16.375,6.25,22.625,0    
                    c6.249-6.25,6.249-16.375,0-22.625l-22.625-22.625c-6.25-6.25-16.376-6.25-22.625,0c-6.25,6.25-6.25,16.375,0,22.625    
                    L131.521,154.167z M380.459,357.812c-6.293-6.25-16.376-6.25-22.625,0c-6.25,6.248-6.293,16.375,0,22.625l22.625,22.625    
                    c6.249,6.248,16.374,6.248,22.625,0c6.249-6.25,6.249-16.377,0-22.625L380.459,357.812z" fill="#FDDA0D" />
                    </g>
                </g>
            </svg>
        </div>

    )
}


function MoonIcon({ }) {
    return (
        <div className="w-[25px] h-[25px] rounded-full bg-slate-800">
            <svg enableBackground="new 0 0 512 512" version="1.1" viewBox="0 0 512 512" xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <path d="M248.082,263.932c-31.52-31.542-39.979-77.104-26.02-116.542c-15.25,5.395-29.668,13.833-41.854,26.02  
            c-43.751,43.75-43.751,114.667,0,158.395c43.729,43.73,114.625,43.752,158.374,0c12.229-12.186,20.646-26.604,26.021-41.854  
            C325.188,303.91,279.604,295.451,248.082,263.932z" fill="#DAD9D7" />
            </svg>
        </div>

    )
}

function handleToggle(setToggle, onToggle) {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
    setToggle(t => {
        if (onToggle) {
            onToggle(!t)
        }
        return !t;
    });
}

function checkDarkTheme(setToggle) {
    const body = document.querySelector("body");
    if (body.classList.contains('dark')) {
        setToggle(false);
    }
}



export default function ToggleColorTheme({ onToggle }) {

    const [toggle, setToggle] = useState(true);

    useEffect(() => {
        checkDarkTheme(setToggle)
    }, [setToggle])

    return (
        <button className="block relative w-[64px] h-[35px] shadow-sm border 
        border-slate-300  rounded-full p-2 bg-slate-200 dark:bg-[#3C50E0] focus:outline-none"
            onClick={(e) => { handleToggle(setToggle, onToggle) }}>


            <div className={`absolute  z-1  w-[25px] h-[25px] rounded-full 
            bg-transparent  transition-position ease-in-out top-1/2  transform  -translate-y-1/2  
          duration-300 ${toggle ? "translate-x-full" : "translate-x-0"}`} >

            </div>

            <div className={`absolute  w-[25px] z-0 h-[25px] rounded-full  
            transition-position ease-in-out top-1/2  transform  -translate-y-1/2  
          duration-300 ${toggle ? "translate-x-0" : "translate-x-full"} shadow-sm`} >
                {toggle ? <SunIcon /> : <MoonIcon />}

            </div>
        </button>
    )
}