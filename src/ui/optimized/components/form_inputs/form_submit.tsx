import { FieldPath, FieldValues } from "react-hook-form";
import React from "react";

import { InputType } from "../inputs/masks_and_validations/format_and_validation";
import { useFormFieldContext } from "../form/form_context";
import TextInput from "../inputs/text_input";
import { useFormContext } from '../../../optimized/components/form/form_context'

interface Props {
  type?: InputType;
  description?: string;
  placeholder?: string;
  enable?: boolean;
  hoverColor?: string;
  width?: string;
  height?: string;
  colorType?: string;
}


const defaultBgColors = {
  Primary: 'bg-[#0A2F4E]',
  Secondary: 'bg-[#2286DD]',
  Success: 'bg-[#28A745]',
  Danger: 'bg-[#DC3545]',
  Warning: 'bg-[#6C757D]',
}

function FormSubmit({
  description = '',
  enable = true,
  hoverColor = 'hover:bg-[#0069D9]',
  width = '',
  height = '',
  colorType = defaultBgColors.Primary,
}: Props) {
  const context = useFormContext<any>();

  return (
    <button
      disabled={!enable}
      className={`block ${height} ${width} px-3 py-2 ${enable ? colorType : 'bg-slate-500'} text-white 
    text-md rounded-md shadow-md text-nowrap ${enable ? hoverColor : 'hover:bg-slate-500 pointer-events-none '} `}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!enable) return
        
        context.manualSubmit()
      }}
    >
      {description}
    </button >
  );
}

export default FormSubmit;
