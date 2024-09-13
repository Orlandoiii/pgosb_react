import React, { useState } from 'react';
import ModalContainer from '../modal/ModalContainer';
import DateTimePicker from './DateTimePicker';
import Button from '../buttons/Button';
import logger from '../../../logic/Logger/logger';




function DateTimePickerRange({ open, onClose, startDate, endDate, onConfirm, onClear, handleDateChange, handleEndDateChange }:
    {
        open: boolean, onClose: () => void, startDate: Date | null, endDate: Date | null,
        onConfirm: () => void,
        onClear: () => void,
        handleDateChange: (date: Date | null) => void, 
        handleEndDateChange: (date: Date | null) => void
    }) {


    logger.log("RENDERIZANDO DATETIMEPICKERRANGE")

    

    return (
        <ModalContainer show={open} onClose={onClose} title="Seleccione el rango de fechas">

            <div className=" w-full h-[160px]  flex flex-col justify-center items-center">

                <div className="w-full h-full flex flex-col gap-2 justify-center">

                    <div className="w-full flex flex-row gap-2 items-center justify-between">
                        <p className="text-lg font-medium">Desde:</p>
                        <DateTimePicker selected={startDate} onChange={(date) => {
                            handleDateChange(date)
                        }} />
                    </div>

                    <div className="w-full flex flex-row gap-2 items-center justify-between">
                        <p className="text-lg font-medium">Hasta:</p>
                        <DateTimePicker disabled={!startDate}
                            minDate={startDate ?? undefined} minTime={startDate ?? undefined} selected={endDate} onChange={handleEndDateChange} />
                    </div>
                </div>

                <div className="w-full flex justify-center gap-2">
                    <Button width='w-full' onClick={(e) => {
                        e.stopPropagation()
                       
                        onConfirm()
                    }}>Confirmar</Button>
                     <Button colorType='bg-blue-500' width='w-full' onClick={(e) => {
                        e.stopPropagation()
                       
                        onClear()
                    }}>Limpiar</Button>
                </div>
            </div>

        </ModalContainer >
    )
}

export default DateTimePickerRange;