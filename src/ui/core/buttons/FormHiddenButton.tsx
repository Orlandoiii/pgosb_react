
import React from "react";

export default function FormHiddenButton({ clickNextRef, clickSubmitRef }) {
    return (
        <button ref={(buttonRef) => {
            if (clickNextRef)
                clickNextRef.current = buttonRef;
            if (clickSubmitRef)
                clickSubmitRef.current = buttonRef;
        }} type="submit" className="w-0 h-0 opacity-0"></button>
    )
}
