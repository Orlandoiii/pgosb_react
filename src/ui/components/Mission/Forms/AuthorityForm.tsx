// import { FieldValues, useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import React, { useState } from 'react'

// import {
//     Authority,
//     AuthorityValidator,
// } from '../../../../domain/models/authority/authority'
// import FormTitle from '../../../core/titles/FormTitle'
// import ModalContainer from '../../../core/modal/ModalContainer'
// import Input from '../../../core/inputs/Input'
// import { Genders } from '../../../../domain/abstractions/enums/genders'
// import Button from '../../../core/buttons/Button'

// import Input2 from '../../../../ui/components/Temp/Input2'
// import Select2 from '../../../../ui/components/Temp/Select2'

// const requiredRule = {
//     required: {
//         value: false,
//         message: 'El campo es requerido',
//     },
// }

// interface AuthorityFormProps {
//     showModal: boolean
//     onClose: () => void
// }

// const genders = [Genders.Male, Genders.Female]
// const areaCodes = ['0212', '0412', '0414', '0424']

// const AuthorityForm = ({ showModal, onClose }: AuthorityFormProps) => {
//     const [areaCode, setAreaCode] = useState(areaCodes[0])
//     const [type, setType] = useState(genders[0])

//     const {
//         register,
//         handleSubmit,
//         setValue,
//         formState: { errors, isSubmitting, isSubmitted },
//         reset,
//     } = useForm<Authority>({
//         resolver: zodResolver(AuthorityValidator),
//     })

//     async function handleSubmitInternal(data: FieldValues) {
//         await new Promise((resolve) => setTimeout(() => {}, 1000))
//         if (true) {
//             reset()
//             setType(genders[1])
//         }
//     }

//     return (
//         <>
//             <ModalContainer
//                 showX={false}
//                 downStikyChildren={''}
//                 show={showModal}
//                 onClose={() => onClose()}
//                 title="Registro de Autoridade u Organismo Presente"
//             >
//                 <form
//                     className="mx-auto mb-5 w-full max-w-[500px] md:max-w-[100%]"
//                     onSubmit={handleSubmit(handleSubmitInternal)}
//                     noValidate
//                 >
//                     <div className="w-80 pb-10">
//                         <Input2
//                             description={'Cédula'}
//                             key={'idDocument'}
//                             register={register}
//                             rules={requiredRule}
//                             isSubmitted={isSubmitted}
//                             errors={errors.idDocument?.message}
//                         />
//                     </div>

//                     <FormTitle title="Datos de la Autoridad u Organización" />

//                     <div className="w-full space-y-3 px-2 max-w-[820px]">
//                         <div className="md:flex md:md:items-start md:space-x-2">
//                             <Select2
//                                 description={'Tipo de Autoridad'}
//                                 options={areaCodes}
//                                 isSubmitted={isSubmitted}
//                                 onChange={(newValue) =>
//                                     setValue('type', newValue)
//                                 }
//                             />

//                             <Input
//                                 register={register as any}
//                                 validationRules={requiredRule as any}
//                                 errMessage={errors.position?.message}
//                                 useStrongErrColor={isSubmitted}
//                                 label={'Cargo'}
//                                 inputName={'position'}
//                                 useDotLabel={true}
//                                 value={''}
//                                 type={''}
//                                 onChangeEvent={() => {}}
//                                 onFocus={() => {}}
//                                 placeHolder="doe"
//                             />
//                         </div>

//                         <div className="h-4"></div>

//                         <div className="md:flex md:md:items-start md:space-x-2">
//                             <Input
//                                 register={register as any}
//                                 validationRules={requiredRule as any}
//                                 errMessage={errors.firstName?.message}
//                                 useStrongErrColor={isSubmitted}
//                                 label={'Nombre'}
//                                 inputName={'firstName'}
//                                 useDotLabel={true}
//                                 value={''}
//                                 type={''}
//                                 onChangeEvent={() => {}}
//                                 onFocus={() => {}}
//                                 placeHolder="jon"
//                             />

//                             <Input
//                                 register={register as any}
//                                 validationRules={requiredRule as any}
//                                 errMessage={errors.lastName?.message}
//                                 useStrongErrColor={isSubmitted}
//                                 label={'Apellido'}
//                                 inputName={'lastName'}
//                                 useDotLabel={true}
//                                 value={''}
//                                 type={''}
//                                 onChangeEvent={() => {}}
//                                 onFocus={() => {}}
//                                 placeHolder="doe"
//                             />

//                             <Input
//                                 register={register as any}
//                                 validationRules={requiredRule as any}
//                                 errMessage={errors.idPlate?.message}
//                                 useStrongErrColor={isSubmitted}
//                                 label={'Placa/SAS'}
//                                 inputName={'idPlate'}
//                                 useDotLabel={true}
//                                 value={''}
//                                 type={''}
//                                 onChangeEvent={() => {}}
//                                 onFocus={() => {}}
//                                 placeHolder="0000000"
//                             />
//                         </div>

//                         <div className="md:flex md:md:items-start md:space-x-2">
//                             <Input
//                                 register={register as any}
//                                 validationRules={requiredRule as any}
//                                 errMessage={errors.vehicles?.message}
//                                 useStrongErrColor={isSubmitted}
//                                 label={'Vehiculos'}
//                                 inputName={'vehicles'}
//                                 useDotLabel={true}
//                                 value={''}
//                                 type={''}
//                                 onChangeEvent={() => {}}
//                                 onFocus={() => {}}
//                                 placeHolder=""
//                             />

//                             <Input
//                                 register={register as any}
//                                 validationRules={requiredRule as any}
//                                 errMessage={errors.auxiliaryQuantity?.message}
//                                 useStrongErrColor={isSubmitted}
//                                 label={'Cantidad Auxiliares'}
//                                 inputName={'auxiliaryQuantity'}
//                                 useDotLabel={true}
//                                 value={''}
//                                 type={''}
//                                 onChangeEvent={() => {}}
//                                 onFocus={() => {}}
//                                 placeHolder=""

//                             />

//                             <Input
//                                 register={register as any}
//                                 validationRules={requiredRule as any}
//                                 errMessage={errors.vehicleQuantity?.message}
//                                 useStrongErrColor={isSubmitted}
//                                 label={'Cantidad de Vehiculos'}
//                                 inputName={'vehicleQuantity'}
//                                 useDotLabel={true}
//                                 value={''}
//                                 type={''}
//                                 onChangeEvent={() => {}}
//                                 onFocus={() => {}}
//                                 placeHolder=""
//                             />
//                         </div>
//                     </div>
//                     <div className="h-8"></div>

//                     <div className="flex flex-col space-y-4">
//                         <div className="flex justify-end space-x-8">
//                             <Button
//                                 colorType="bg-[#3C50E0]"
//                                 onClick={() => {}}
//                                 onClickRaw={() => {}}
//                                 children={'Aceptar'}
//                             ></Button>
//                         </div>
//                     </div>
//                 </form>
//             </ModalContainer>
//         </>
//     )
// }

// export default AuthorityForm
