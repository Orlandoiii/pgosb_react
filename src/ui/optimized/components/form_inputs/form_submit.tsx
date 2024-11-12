import { FieldPath, FieldValues } from "react-hook-form";
import React from "react";

import { InputType } from "../inputs/masks_and_validations/format_and_validation";
import { useFormFieldContext } from "../form/form_context";
import TextInput from "../inputs/text_input";

interface Props {
  type?: InputType;
  description?: string;
  placeholder?: string;
  disable?: boolean;
}

// function FormSubmit({
//   type = "Any",
//   description = '',
//   disable = false,
// }: Props) {
//   const { fieldRegister, fieldError, isSubmitted } = useFormFieldContext<T>(fieldName);

//   return (
//     <button
//     disabled={!enable}
//     className={`block ${height} ${width} px-3 py-2 ${enable ? colorType : 'bg-slate-500'} text-white 
//     text-md rounded-md shadow-md text-nowrap ${enable ? hoverColor : 'hover:bg-slate-500 pointer-events-none '} `}
//     onClick={(e) => {
//         if (!enable) return
//         onClick && onClick(e)
//     }}
// >
//     {children}
// </button >
//   );
// }

// export default FormSubmit;
