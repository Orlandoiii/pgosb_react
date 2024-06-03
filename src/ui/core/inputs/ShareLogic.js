class TailwindPrecompile {
    hovererrColor = "hover:border-rose-500";
    hoveractiveColor = "hover:border-[#007BFF]";
    hoverneutralColor = "hover:border-gray-300";
    hovererrSoftColor = "hover:border-slate-500"


    focuserrColor = "focus:border-rose-500";
    focusactiveColor = "focus:border-[#007BFF]";
    focusneutralColor = "focus:border-gray-300";
    focuserrSoftColor = "focus:border-slate-500";

    hasfocuserrColor = " has-[:focus]:border-rose-500";
    hasfocusactiveColor = " has-[:focus]:border-[#007BFF]";
    hasfocusneutralColor = " has-[:focus]:border-gray-300";
    hasfocuserrSoftColor = " has-[:focus]:border-slate-500";

    wfocuserrColor = " focus-within:border-rose-500";
    wfocusactiveColor = " focus-within:border-[#007BFF]";
    wfocusneutralColor = " focus-within:border-gray-300";
    wfocuserrSoftColor = " focus-within:border-slate-500";

}


class DefaultInputsValidations {

}

class CommonLogic {
    static emptyRegister = {
        onChange: null,
        onBlur: null,
        name: "",
        ref: null,
    }

    static errColor = "border-rose-500";
    static activeColor = "border-[#007BFF]";
    static neutralColor = "border-gray-300";
    static errSoftColor = "border-slate-500"





    isErr(errMessage) {
        return errMessage && errMessage?.length > 0;
    }

    borderColor(errMessage, useStrongErrColor) {
        if (this.isErr(errMessage))
            return useStrongErrColor ? CommonLogic.errColor : CommonLogic.errSoftColor;

        return CommonLogic.activeColor
    }
}

export { DefaultInputsValidations, CommonLogic }