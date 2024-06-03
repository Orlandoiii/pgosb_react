import Input from "./Input";
import { CommonLogic } from "./ShareLogic";

const common = new CommonLogic();

function AddButton({ }) {
    return (
        <button type='button' className='w-5 h-5  bg-[#3C50E0] rounded-full flex items-center justify-center cursor-pointer transition-all duration-500  hover:bg-indigo-700'>
            <svg className="w-3 h-3" viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M1.22229 5.00019H8.77785M5.00007 8.77797V1.22241'
                    stroke='white' strokeWidth='1.6'
                    strokeLinecap='round'
                    strokeLinejoin='round'></path>
            </svg>
        </button>
    )
}


function EyeButton({ }) {
    return (
        <button type='button' className='w-5 h-5 bg-[#3C50E0] rounded-full flex items-center justify-center cursor-pointer transition-all duration-500  hover:bg-indigo-700'>
            <svg className="w-3 h-3" fill="#FFFFFF" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                    <path d="m1 12s4-8 11-8 11 8 11 8" />
                    <path d="m1 12s4 8 11 8 11-8 11-8" />
                    <circle cx="12" cy="12" r="3" />
                </g>
            </svg>
        </button>
    )
}


function Buttons({ }) {
    return (
        <div className="absolute top-1/2 right-1 transform -translate-y-1/2 flex justify-between space-x-1">
            <EyeButton />
            <AddButton />
        </div>
    )

}





export default function AddInputFloat({
    inputName,
    label,
    value,
    type = "text",

    onChangeEvent,
    onFocus,
    onMouseDown = null,
    errMessage = '',
    register = null,
    validationRules = null,
    useDotLabel = false,
    useStrongErrColor = false,
    placeHolder = "",
}) {



    return (
        <div className="flex justify-center">
            <Input
                label={label}
                value={value}
                type={type}
                inputName={inputName}
                register={register}
                validationRules={validationRules}

                onChangeEvent={onChangeEvent}
                onMouseDown={onMouseDown}
                placeHolder={placeHolder}
                readOnly={false}
                onFocus={onFocus}
                useDotLabel={useDotLabel}
                errMessage={errMessage}
                useStrongErrColor={useStrongErrColor}
                icons={
                    <Buttons />

                }
            />


        </div>
    )
}
