import logger from "../../../logic/Logger/logger";
import { useMask, useNoMask } from "./Common/Common";
import { CommonLogic } from "./ShareLogic";

const common = new CommonLogic();

export default function Input({

    inputName,
    label,
    useDotLabel = false,
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
    controlled = false,
    turnOffAutoCompleted = true,
    maskDefinition,


}) {


    logger.log("Renderizo NewInput")

    if (!inputName)
        inputName = label;


    const { onChange, onBlur, ref } = register != null && !controlled ?
        register(inputName, validationRules ?? {}) : CommonLogic.emptyRegister;


    const { maskMainRef } = maskDefinition ? useMask(
        maskDefinition) : useNoMask()

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
        <div className={`group w-full relative flex flex-col justify-center`}>

            <label className={`block text-[0.9rem] mb-2`} htmlFor={inputName}>
                {`${useDotLabel ? label + ":" : label}`}
            </label>

            <div className={`relative h-11 w-full  p-1 rounded-md shadow-sm
                             border-2 
                             ${!common.isErr(errMessage, useStrongErrColor) ?
                    CommonLogic.neutralColor :
                    (useStrongErrColor ? CommonLogic.errColor : CommonLogic.errSoftColor)}  
                             hover:border-3.5  hover:${common.borderColor(errMessage, useStrongErrColor)} 
                             has-[:focus]:border-3.5 has-[:focus]:${common.borderColor(errMessage, useStrongErrColor)} `}>
                <input
                    className="w-full h-full outline-none px-2 my-auto border-0 bg-transparent"
                    ref={e => {
                        if (ref)
                            ref(e);
                        if (inputRef)
                            inputRef.current = e;
                        if (maskDefinition && maskMainRef) {
                            maskMainRef.current = e;
                        }
                    }}

                    id={inputName}
                    type={type}
                    {...(controlled ? { value: value } : { defaultValue: value })}

                    {...(turnOffAutoCompleted ? { autoComplete: "off" } : {})}

                    name={inputName}
                    placeholder={placeHolder}
                    readOnly={readOnly}


                    onChange={handleOnChange}
                    onFocus={onFocus}
                    onMouseDown={onMouseDown}
                    onBlur={handleOnBlur}

                />
                {icons}

            </div>

            <span className={`absolute left-0 top-full w-full overflow-x-hidden 
                text-ellipsis whitespace-nowrap text-sm  px-2 bg-transparent transition-all ease-in-out duration-500
                ${useStrongErrColor ? "text-rose-500" : "text-slate-500"} 
                ${errMessage && errMessage?.length > 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>{errMessage}</span>



        </div>
    )
}

