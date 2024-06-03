import { createPortal } from 'react-dom';
import { useEffect, useRef } from "react";

function CloseXSimbol({ onClose }) {
    return (
        <button className='w-7 bg-rose-500 rounded-full p-2 
        absolute top-2 right-4 shadow-md swadow-slate-500 focus:outline-none'
            onClick={(e) => {
                e.stopPropagation();
                if (onClose) onClose(e);
            }}>
            <div className="flex w-full justify-end">
                <div className="fill-secundary w-8">

                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.7 20.1C5.20294 20.5971 4.39706 20.5971 3.9 20.1C3.40294 19.6029 3.40294 18.7971 3.9 18.3L10.2 12L3.9 5.7C3.40294 5.20294 3.40294 4.39706 3.9 3.9C4.39706 3.40294 5.20294 3.40294 5.7 3.9L12 10.2L18.3 3.9C18.7971 3.40294 19.6029 3.40294 20.1 3.9C20.5971 4.39706 20.5971 5.20294 20.1 5.7L13.8 12L20.1 18.3C20.5971 18.7971 20.5971 19.6029 20.1 20.1C19.6029 20.5971 18.7971 20.5971 18.3 20.1L12 13.8L5.7 20.1Z" fill="#FFFFFF">
                        </path>
                    </svg>
                </div>
            </div>
        </button>
    )
}


export default function ModalContainer({ show, onClose, showX = true, children = null, childrenHeigth = "", title = "" }) {

    const parentNode = useRef(null);

    useEffect(() => {
        let doc = document.querySelector("#modal-root");
        parentNode.current = doc;
    }, [])


    return parentNode?.current != null ? (createPortal(<div className={`fixed left-0 top-0 w-screen h-screen overflow-auto  md:h-screen md:w-screen flex items-center justify-center 
           bg-black bg-opacity-20 duration-300 ease-in-out z-10 ${!show ? "opacity-0 pointer-events-none" : ""}`}>

        <div className="relative w-full h-full md:h-auto overflow-auto rounded-xl bg-white shadow-lg shadow-gray-400 lg:max-w-[1000px]">

            {showX && <CloseXSimbol onClose={onClose} />}

            {title && title.length > 0 && <h2 className='w-full bg-[#3C50E0] rounded-t-xl flex justify-center items-center
            text-[whitesmoke] text-md h-11 p-2 shadow-md'>{title}</h2>}

            <div className='w-full h-auto p-5 min-w-[375px]  min-h-[375px] shadow-md'>

                {show && children}

            </div>

        </div>
    </div >, parentNode.current)
    ) : <></>;
}