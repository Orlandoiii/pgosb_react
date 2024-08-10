import React, { ComponentPropsWithoutRef, LegacyRef, useCallback, useEffect } from "react";
import { ReactNode } from "react";

import { CommonLogic } from "./ShareLogic";
import { IMask } from "react-imask";

const common = new CommonLogic();

export interface TextAreaProps extends ComponentPropsWithoutRef<"textarea"> {
    inputName: string,
    label?: string,
    errMessage?: string,
    useStrongErrColor?: boolean,
    icons?: ReactNode,
    inputRef?: React.MutableRefObject<HTMLTextAreaElement | null> | undefined,
    refCallback?: React.RefCallback<HTMLTextAreaElement> | undefined,
    resetCount?: number,
    maskDefinition?: any
}

export default function TextArea({

    inputName,
    label,
    errMessage = '',
    useStrongErrColor = false,
    icons,
    inputRef,
    refCallback,
    maskDefinition = null,
    resetCount = 0,
    ...rest

}: TextAreaProps) {



    const mergedRef = useCallback((node: HTMLTextAreaElement ) => {
        if (inputRef)
            inputRef.current = node;
        if (refCallback)
            refCallback(node)

    }, []);

    useEffect(() => {

        if (!maskDefinition)
            return;

        const input = document.getElementById(inputName)
        const imask = IMask(input!, maskDefinition)
        imask.updateValue()

        return () => imask.destroy()
    }, [resetCount])

    return (
        <div className={`group h-full w-full relative flex flex-col justify-center`}>

            {/* <label className={`block text-[0.9rem] mb-2`} htmlFor={inputName}>
                {label}
            </label> */}

            <div className={`relative h-full w-full  p-1 rounded-md shadow-sm
                             border-2 
                             ${!common.isErr(errMessage) ?
                    CommonLogic.neutralColor :
                    (useStrongErrColor ? CommonLogic.errColor : CommonLogic.errSoftColor)}  
                             hover:border-3.5  hover:${common.borderColor(errMessage, useStrongErrColor)} 
                             has-[:focus]:border-3.5 has-[:focus]:${common.borderColor(errMessage, useStrongErrColor)} `}>

                <textarea 
                {...rest}
                name={inputName} 
                id={inputName} 
                ref={mergedRef}
                autoComplete="off"
                className="w-full h-full outline-none px-2 my-auto border-0 bg-transparent"
                ></textarea>
                {icons}

            </div>

            <span className={`absolute left-0 top-full w-full overflow-x-hidden 
                text-ellipsis whitespace-nowrap text-[0.75rem]  px-2 bg-transparent transition-all ease-in-out duration-500
                ${useStrongErrColor ? "text-rose-500" : "text-slate-500"} 
                ${errMessage && errMessage?.length > 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>{errMessage}</span>



        </div>
    )
}

