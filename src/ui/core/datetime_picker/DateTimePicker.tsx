import React, { useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import { registerLocale } from 'react-datepicker';
import logger from '../../../logic/Logger/logger';

registerLocale('es', es as any);

interface DateTimePickerProps {
  onChange: (date: Date | null) => void;
  selected: Date | null;
  placeholderText?: string;
  width?: string;
  minDate?: Date | undefined;
  minTime?: Date | undefined;
  disabled?: boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  onChange,
  selected,
  placeholderText = 'Seleccione fecha y hora...',
  width = 'w-auto',
  minDate = undefined,
  minTime = undefined,
  disabled = false
}) => {

  logger.log("RENDERIZANDO DATETIMEPICKER COMPONENTE")
 
  //const handleChange = (date: Date | null) => {
  //  if (date && minDate && minTime) {
  //    const selectedTime = date.getTime();
  //    const minDateTime = new Date(
  //      minDate.getFullYear(),
  //      minDate.getMonth(),
  //      minDate.getDate(),
  //      minTime.getHours(),
  //      minTime.getMinutes()
  //    ).getTime();
//
  //    if (selectedTime < minDateTime) {
  //      date.setHours(minTime.getHours(), minTime.getMinutes());
  //    }
  //  }
  //  onChange(date);
  //};

  const handleChange = (date: Date | null) => {
    onChange(date);
  };


  const filterTime = useMemo(() => {
    return (time: Date) => {
      if (!minDate || !minTime || !selected) return true;

      const selectedDate = new Date(selected);
      selectedDate.setHours(0, 0, 0, 0);
      const minDateTime = new Date(minDate);
      minDateTime.setHours(0, 0, 0, 0);

      if (selectedDate.getTime() === minDateTime.getTime()) {
        return time.getTime() >= minTime.getTime();
      }
      return true;
    };
  }, [minDate, minTime, selected]);


  return (
    <DatePicker
      selected={selected}
      showYearDropdown
      yearDropdownItemNumber={8}
      minDate={minDate}
      disabled={disabled}
      onChange={handleChange}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="Hora"
      dateFormat="dd/MM/yyyy HH:mm"
      placeholderText={placeholderText}
      locale="es"
      filterTime={filterTime}
      className={`${width} text-lg text-center font-bold p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
    />
  );
};

export default DateTimePicker;
