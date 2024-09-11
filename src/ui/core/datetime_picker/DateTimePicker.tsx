import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateTimePickerProps {
  onChange: (date: Date | null) => void;
  selected: Date | null;
  placeholderText?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  onChange,
  selected,
  placeholderText = 'Select date and time...'
}) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      showTimeSelect
      timeFormat="HH:mm:ss"
      timeIntervals={1}
      timeCaption="Time"
      dateFormat="MMMM d, yyyy h:mm:ss aa"
      placeholderText={placeholderText}
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default DateTimePicker;
