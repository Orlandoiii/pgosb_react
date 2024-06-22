import { CommonLogic } from "./ShareLogic";

const common = new CommonLogic();


const activeClasses = "h-auto -top-[30%] text-sm bg-inherit";
const neutralClasses = "bg-transparent  h-full  top-0 left-2"

export default function InputFloatLabel({

    inputName,
    label,

    value,
    type = "text",
    placeHolder = "",
    readOnly = false,

    errMessage = '',
    useStrongErrColor = false,
    icons,

    onChangeEvent,
    onFocus,
    onMouseDown,

    register,
    validationRules,

    inputRef = null,
    controlled = false


}) {


    logger.log("Renderizo NewInput")

    if (!inputName)
        inputName = label;


    const { onChange, onBlur, ref } = register != null && !controlled ?
        register(inputName, validationRules ?? {}) : CommonLogic.emptyRegister;


    function handleOnChange(e) {
        if (register) {

            onChange(e);
            return;
        }

        if (onChangeEvent) {
            onChangeEvent(e)
        }

    }

    function handleOnBlur(e) {

        if (onBlur) {
            onBlur(e)
        }
    }



    return (
        <div
            className={`relative flex flex-col  h-11 w-full p-1 rounded-md  bg-inherit shadow-md
                        border-2 ${!common.isErr(errMessage) ? CommonLogic.neutralColor :
                    (useStrongErrColor ? CommonLogic.errColor : CommonLogic.errSoftColor)}    
                        focus-within:border-3.5 focus-within:${common.borderColor(errMessage, useStrongErrColor)} 
                        hover:border-3.5 hover:${common.borderColor(errMessage, useStrongErrColor)} `}
            onClickCapture={() => {
                inputRef?.current?.focus()
            }}


        >
            <input
                className={`peer w-full h-full appearance-none rounded-md bg-transparent
                border-transparent
                px-3 py-4 text-gray-900 placeholder-transparent outline-none focus:ring-0`}

                ref={e => {
                    if (ref)
                        ref(e);
                    if (inputRef)
                        inputRef.current = e;
                }}

                id={inputName}
                type={type}
                {...(controlled ? { value: value } : { defaultValue: value })}


                name={inputName}
                placeholder={placeHolder}
                readOnly={readOnly}


                onChange={handleOnChange}
                onFocus={onFocus}
                onMouseDown={onMouseDown}
                onBlur={handleOnBlur}
            />

            <label
                htmlFor={label}
                className={`absolute flex items-center  
                ${inputRef?.current?.value?.length > 0 || value?.length > 0 ? activeClasses : neutralClasses}   
                    transition-all ease-in-out duration-200 
                  peer-focus:h-auto peer-focus:-top-[30%] peer-focus:text-sm peer-focus:bg-inherit`}


            >
                {label}
            </label>

            {icons}

            {errMessage && errMessage.length ?
                <span className={`text-xs font-light p-1 bg-transparent 
                ${useStrongErrColor ? "text-rose-500" : "text-slate-500"} `}>{errMessage}</span>
                : null}

        </div>
    )
}
