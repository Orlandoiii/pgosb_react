// import { zodResolver } from '@hookform/resolvers/zod'
// import React from 'react'
// import { z } from 'zod'

// import { DefaultValues, FieldValues, useForm } from 'react-hook-form'
// import { TVehicleInvolved, VehicleInvolvedSchema } from '../../../domain/models/vehicle/vehicle_involved'

// interface Form2Props<T> {
//     schema: z.Schema<T>
//     initValue?: T | undefined
//     onSubmit: (data: T) => void
// }

// function Form2<T>({
//     schema,
//     initValue = schema.parse({}),
//     onSubmit,
// }: Form2Props<T>) {
//     const {
//         register,
//         handleSubmit,
//         setValue,
//         formState: { errors, isSubmitted },
//         reset,
//     } = useForm<T>({
//         resolver: zodResolver(schema),
//         defaultValues: initValue ?? {},
//     })

//     return (
//         <form
//             className="mx-auto mb-5 w-full max-w-[500px] md:max-w-[100%]"
//             onSubmit={handleSubmit(onSubmit)}
//             noValidate
//         ></form>
//     )
// }

// export default Form2

// const temp2 = () => {
//     return (
//         <div>
//             <Form2
//                 schema={VehicleInvolvedSchema}
//                 onSubmit={(values) => {}}
//             ></Form2>
//         </div>
//     )
// }
