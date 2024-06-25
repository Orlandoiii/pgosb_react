import { useState } from "react"
import { EyeButton, StoreList } from "../inputs/AddInput";
import ModalContainer from "../modal/ModalContainer";
import logger from "../../../logic/Logger/logger";


function isBoolean(value) {
    let isBool = typeof value === 'boolean';

    return isBool;
}

function splitArrayInHalf(arr) {
    if (!arr || arr.length === 0) return [[], []]; // Handle empty arrays

    const midIndex = Math.ceil(arr.length / 2); // Calculate middle index (round up for odd lengths)
    const firstHalf = arr.slice(0, midIndex); // Slice from beginning to middle
    const secondHalf = arr.slice(midIndex);   // Slice from middle to end

    return [firstHalf, secondHalf];
}
function KeyValue({ keyName, value }) {
    const valueIsArray = Array.isArray(value);

    // const originalValue = value;

    if (!valueIsArray && !isBoolean(value) && value.length > 25) {
        value = "..." + value.slice(0, 23);
    }

    return (

        <div className="w-full flex justify-between items-baseline">


            <p className="capitalize-first text-sm font-medium text-gray-700">{keyName}:</p>

            {valueIsArray ?
                <ArrayElement title={keyName} values={value} /> :
                <p className="text-[#0A2F4E] text-sm font-semibold">{isBoolean(value) ? value.toString() : value}</p>}

        </div>


    )
}



function ArrayElement({ title, values }) {
    const [open, setOpen] = useState(false);

    return (

        <div className="flex flex-col justify-between items-center">

            <EyeButton onClick={() => { setOpen(o => !o) }} />

            <ModalContainer title={title} show={open} onClose={() => { setOpen(false) }}>
                <StoreList items={values} showDelete={false}></StoreList>
            </ModalContainer>

        </div>
    )

}



export default function Accordion({ title, value, configNames }) {

    const [open, setOpen] = useState(true);



    const [firstHalf, secondHalf] = splitArrayInHalf(Object.entries(value));

    logger.log("Renderizando Accordion Data:", value);

    logger.log("first:", firstHalf);
    logger.log("second:", secondHalf);



    return (
        <div className="md:min-w-[600px] h-auto rounded-md border border-slate-200 p-2 shadow-sm   bg-gray-50">
            <button className="flex w-full items-center justify-between  gap-2  p-1 px-2 bg-[#0A2F4E] rounded-md shadow-md" onClick={() => { setOpen(o => !o) }}>
                <div className="">
                    <h4 className="text-left text-sm font-bold text-[whitesmoke]">{title}</h4>
                </div>
                <div className="flex h-[22px]  w-[22px] items-center justify-center rounded-full border-2 border-[whitesmoke] dark:border-white">
                    <svg className={`fill-[whitesmoke] transition-all duration-200 ease-in-out w-[11px] h-[11px] ${open ? "hidden" : "block"}`} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.2969 6.51563H8.48438V1.70312C8.48438 1.15625 8.04688 0.773438 7.5 0.773438C6.95313 0.773438 6.57031 1.21094 6.57031 1.75781V6.57031H1.75781C1.21094 6.57031 0.828125 7.00781 0.828125 7.55469C0.828125 8.10156 1.26563 8.48438 1.8125 8.48438H6.625V13.2969C6.625 13.8438 7.0625 14.2266 7.60938 14.2266C8.15625 14.2266 8.53906 13.7891 8.53906 13.2422V8.42969H13.3516C13.8984 8.42969 14.2813 7.99219 14.2813 7.44531C14.2266 6.95312 13.7891 6.51563 13.2969 6.51563Z" fill="">
                        </path>
                    </svg>
                    <svg className={`fill-[whitesmoke] transition-all duration-200 ease-in-out w-[11px] h-[11px] ${open ? "block" : "hidden"}`} viewBox="0 0 15 3" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.503 0.447144C13.446 0.447144 13.503 0.447144 13.503 0.447144H1.49482C0.925718 0.447144 0.527344 0.902427 0.527344 1.47153C0.527344 2.04064 0.982629 2.43901 1.55173 2.43901H13.5599C14.129 2.43901 14.5273 1.98373 14.5273 1.41462C14.4704 0.902427 14.0151 0.447144 13.503 0.447144Z" fill="">
                        </path>
                    </svg>
                </div>
            </button>

            <div className={`mt-1 transition-all duration-700 ease-in-out 
                ${open ? "h-auto block md:flex  md:justify-between md:space-x-8  py-1 px-1" : " h-0 hidden"} `}>

                <div className="flex-1 ">
                    {firstHalf && Object.entries(firstHalf).map(([idx, value]) => {
                        return <KeyValue keyName={configNames && configNames[value[0]] ? configNames[value[0]] :
                            value[0]} value={value[1]} key={value[0]} />
                    })}
                </div>

                <div className="flex-1">
                    {secondHalf && Object.entries(secondHalf).map(([idx, value]) => {
                        return <KeyValue keyName={configNames && configNames[value[0]] ? configNames[value[0]] :
                            value[0]} value={value[1]} key={value[0]} />
                    })}
                </div>
            </div>
        </div>
    )
}





