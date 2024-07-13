import { FieldValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'

import FormTitle from '../../../core/titles/FormTitle'
import ModalContainer from '../../../core/modal/ModalContainer'
import { Genders } from '../../../../domain/abstractions/enums/genders'
import Button from '../../../core/buttons/Button'

import {
    TVehicleInvolved,
    VehicleInvolvedSchema,
} from '../../../../domain/models/vehicle/vehicle_involved'
import Input2 from '../../../../ui/components/Temp/Input2'
import Select2 from '../../../../ui/components/Temp/Select2'
import { EnumToStringArray } from '../../../../utilities/converters/enum_converter'
import { DocumentTypes } from '../../../../domain/abstractions/enums/document_types'

const requiredRule = {
    required: {
        value: false,
        message: 'El campo es requerido',
    },
}

interface AuthorityFormProps {
    showModal: boolean
    initValue?: TVehicleInvolved | null
    onClose: () => void
}

const AuthorityForm = ({
    showModal,
    initValue,
    onClose,
}: AuthorityFormProps) => {
    const areaCodes = EnumToStringArray(AreaCodes)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitted },
        reset,
    } = useForm<TVehicleInvolved>({
        resolver: zodResolver(VehicleInvolvedSchema),
        defaultValues: initValue != null ? initValue : {},
    })

    async function handleSubmitInternal(data: FieldValues) {
        await new Promise((resolve) => setTimeout(() => {}, 1000))
        if (true) {
            reset()
        }
    }

    type Keys<T extends object> = keyof T
    return (
        <>
            <ModalContainer
                showX={false}
                downStikyChildren={''}
                show={showModal}
                onClose={() => onClose()}
                title="Registro de Autoridade u Organismo Presente"
            >
                <form
                    className="mx-auto mb-5 w-full max-w-[500px] md:max-w-[100%]"
                    onSubmit={handleSubmit(handleSubmitInternal)}
                    noValidate
                >
                    <FormTitle title="Datos del Vehiculo" />

                    <div className="w-full space-y-3 px-2 max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <Input2
                                description={'Placa'}
                                key={'licensePlate'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.licensePlate?.message}
                            />

                            <Select2
                                description={'Marca'}
                                options={areaCodes}
                                isSubmitted={isSubmitted}
                                onChange={(newValue) =>
                                    setValue('brand', newValue)
                                }
                            />

                            <Select2
                                description={'Modelo'}
                                options={areaCodes}
                                isSubmitted={isSubmitted}
                                onChange={(newValue) =>
                                    setValue('model', newValue)
                                }
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <Input2
                                description={'Serial del Motor'}
                                key={'motorSerial'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.motorSerial?.message}
                            />

                            <Select2
                                description={'Tipo'}
                                options={areaCodes}
                                isSubmitted={isSubmitted}
                                onChange={(newValue) =>
                                    setValue('type', newValue)
                                }
                            />

                            <Input2
                                description={'Año'}
                                key={'year'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.year?.message}
                            />

                            <Input2
                                description={'Color'}
                                key={'color'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.color?.message}
                            />
                        </div>
                        <div className="h-4"></div>
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <Input2
                                description={'Condición'}
                                key={'condition'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.condition?.message}
                            />
                        </div>
                    </div>
                    <div className="h-8"></div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-end space-x-8">
                            <Button
                                colorType="bg-[#3C50E0]"
                                onClick={() => {}}
                                onClickRaw={() => {}}
                                children={'Aceptar'}
                            ></Button>
                        </div>
                    </div>
                </form>
            </ModalContainer>
        </>
    )
}

export default AuthorityForm
