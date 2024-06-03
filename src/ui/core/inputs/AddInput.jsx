import { CommonLogic } from "./ShareLogic";

const common = new CommonLogic();


function AddButton({ }) {
    return (
        <button type='button' className='border border-gray-500 rounded-e-md  h-full w-9  bg-[#3C50E0]  flex items-center justify-center cursor-pointer transition-all duration-500  hover:bg-indigo-700'>
            <svg className="w-4 h-4" viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
        <button type='button' className='h-full w-9 border-gray-500 rounded-e-md bg-[#3C50E0] flex items-center justify-center cursor-pointer transition-all duration-500  hover:bg-indigo-700'>
            <svg className="w-4 h-4" fill="#FFFFFF" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                    <path d="m1 12s4-8 11-8 11 8 11 8" />
                    <path d="m1 12s4 8 11 8 11-8 11-8" />
                    <circle cx="12" cy="12" r="3" />
                </g>
            </svg>
        </button>
    )
}


function EyeButtonFloat({ }) {
    return (
        <button type='button' className='absolute top-1/2 right-1 transform -translate-y-1/2 w-5 h-5 bg-[#3C50E0] rounded-full flex items-center justify-center cursor-pointer transition-all duration-500  hover:bg-indigo-700'>
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
        <div className="h-full w-auto flex justify-between rounded-md">
           
            <AddButton />
        </div>
    )

}


export default function AddInput({
    inputName,
    label,
    value,
    type = "text",
    onChangeEvent,
    onFocus,
    onMouseDown = null,
    readOnly = false,
    icons = null,
    errMessage = '',
    register = null,
    validationRules = null,
    useDotLabel = false,
    useStrongErrColor = false,
    placeHolder = ""
}) {

    if (!inputName)
        inputName = label;


    const { onChange, onBlur, name, ref } = register != null ?
        register(inputName, validationRules ?? {}) : CommonLogic.emptyRegister;


    function handleOnChange(e) {
        if (readOnly)
            return;

        if (register) {
            onChange(e);
            return;
        }
        if (onChangeEvent)
            onChangeEvent(e);
    }

    function handleOnBlur(e) {
        if (readOnly)
            return;

        if (onBlur) {
            onBlur(e)
        }
    }

    function handleOnMouseDown(e) {
        if (readOnly)
            return;
        if (onMouseDown) {
            onMouseDown(e)
        }
    }

    return (
        <div className={`group w-full relative flex flex-col justify-center`}>

            <label className={`block text-sm mb-2`} htmlFor={inputName}>
                {`${useDotLabel ? label + ":" : label}`}
            </label>

            <div className="flex">

                <div className={`relative h-11 w-full  rounded-md shadow-md flex
                             border-2 
                             ${!common.isErr(errMessage, useStrongErrColor) ?
                        CommonLogic.neutralColor :
                        (useStrongErrColor ? CommonLogic.errColor : CommonLogic.errSoftColor)}  
                             hover:border-3.5  hover:${common.borderColor(errMessage, useStrongErrColor)} 
                             has-[:focus]:border-3.5 has-[:focus]:${common.borderColor(errMessage, useStrongErrColor)} `}>
                    <input
                        className="w-full h-full outline-none p-2 my-auto border-0 bg-transparent"
                        ref={ref}
                        id={inputName}
                        type={type}
                        value={value}
                        name={name}
                        onChange={handleOnChange}
                        onFocus={onFocus}
                        onMouseDown={handleOnMouseDown}
                        readOnly={readOnly}
                        onBlur={handleOnBlur}
                        placeholder={placeHolder}

                    />
                    {<EyeButtonFloat/>}

                </div>
                <div className="rounded-md"> 
                    <Buttons />
                </div>
            </div>


            {errMessage && errMessage?.length > 0 ?
                <span className={`text-[0.7rem] font-light p-1 bg-transparent  
                ${useStrongErrColor ? "text-rose-500" : "text-slate-500"} `}>{errMessage}</span>
                : null}

        </div>
    )
}
