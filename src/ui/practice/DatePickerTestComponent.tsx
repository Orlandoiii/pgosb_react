import React, { useState } from "react";
import DateTimePicker from "../core/datetime_picker/DateTimePicker";
import DateTimePickerRange from "../core/datetime_picker/DateTimePickerRange";
import Button from "../core/buttons/Button";

function DatePickerTestComponent() {

    const [open, setOpen] = useState(false);

    return (
        <div className="w-full h-full flex justify-center items-center">
            
            <Button onClick={() => { setOpen(true) }}>Open</Button>
        </div>
    )
}

export default DatePickerTestComponent;