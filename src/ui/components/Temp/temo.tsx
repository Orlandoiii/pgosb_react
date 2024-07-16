// import { z } from 'zod'

// import React from 'react'
// import { FieldPath, FieldValues, InternalFieldName, useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'

// type TAlgo = z.infer<typeof algoSchema>

// const subAlgo = z.object({
//     child1: z.string(),
//     child2: z.string(),
//     child3: z.string(),
// })

// const algoSchema = z.object({
//     element1: z.string(),
//     element2: z.number(),
//     element3: z.boolean(),
//     element4: z.enum(['one', 'two']),
//     element5: subAlgo,
// })

// export default function Component(initValue: TAlgo | null) {
//     const {
//         register,
//         handleSubmit,
//         setValue,
//         formState: { errors, isSubmitted },
//         reset,
//     } = useForm<TAlgo>({
//         resolver: zodResolver(algoSchema),
//         defaultValues: initValue != null ? initValue : {},
//     })

//     var a = errors['element5'] && errors['element5']['child1']
// a?.message
//     return
//     ;<>
//         {test(register, 'element5.child1' )}
//         <input type="text" {...register('element5.child1')} />
//     </>
// }

// function test<T extends FieldValues, TFieldName extends FieldPath<T> = FieldPath<T>>(
//     register: UseFormRegister<T>,
//     key: TFieldName
// ) {
//     return <></>
// }

// function prueba<TFieldValues extends FieldValues>(){

//     const lkas: UseFormRegister<TFieldValues> = (name, options = {}) => {
// }
    
// }

// const asjdl: UseFormRegister<T>  = (name, options = {}) =>{}

// export type UseFormRegister<TFieldValues extends FieldValues> = <
//   TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
// >(
//   name: TFieldName,
//   options?: any,
// ) => UseFormRegisterReturn<TFieldName>;


// export type UseFormRegisterReturn<
//   TFieldName extends InternalFieldName = InternalFieldName,
// > = {
//   name: TFieldName;
//   min?: string | number;
//   max?: string | number;
//   maxLength?: number;
//   minLength?: number;
//   pattern?: string;
//   required?: boolean;
//   disabled?: boolean;
// };
