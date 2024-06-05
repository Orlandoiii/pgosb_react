import { CommonLogic } from "./ShareLogic";

const common = new CommonLogic();

export default function Input({
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
    placeHolder = "",
    outsideInputRef = null
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

            <div className={`relative h-11 w-full  p-1 rounded-md shadow-md
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
                        if (outsideInputRef)
                            outsideInputRef.current = e;
                    }}
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
                {icons}

            </div>
            {errMessage && errMessage?.length > 0 ?
                <span className={`text-[0.7rem] font-light p-1 bg-transparent  
                ${useStrongErrColor ? "text-rose-500" : "text-slate-500"} `}>{errMessage}</span>
                : null}


        </div>
    )
}
