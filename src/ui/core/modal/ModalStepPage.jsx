import { useEffect, useRef } from "react";
import { createPortal } from "react-dom"

function CloseArrowIcon({ onClick }) {
    return <button className="w-[40px] h-[44px]" onClick={onClick}>
        <svg className="fill-[#0A2F4E]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
        </svg>
    </button>
}


export function ModalStepPage({ show, onClose, children, parent }) {
    let parentNode = useRef(null);

    parentNode.current = parent;

    useEffect(() => {
        if (!parentNode.current) {
            parentNode.current = document.querySelector("#step-page-modal");
        }
    }, [])

    return parentNode?.current != null ?
        createPortal(
            <div className={`absolute top-0 left-0 transition-all ease-in-out duration-700 
               ${show ? "translate-x-0" : "translate-x-[100%]"}  h-full w-full bg-[#EEF2F6] p-2 overflow-hidden`}>

                <div className="absolute top-0 left-5 z-10">
                    <CloseArrowIcon onClick={onClose} />
                </div>

                <div className="w-full h-auto px-16 py-4 overflow-auto">
                    {children}
                </div>
            </div>, parentNode.current) : <></>

}