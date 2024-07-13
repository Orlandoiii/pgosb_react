import { FieldValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'

import FormTitle from '../../../core/titles/FormTitle'
import ModalContainer from '../../../core/modal/ModalContainer'
import { Genders } from '../../../../domain/abstractions/enums/genders'
import Button from '../../../core/buttons/Button'

import {
    TPersonInvolved,
    PersonInvolvedSchema,
} from '../../../../domain/models/person/person_involved'
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

interface PersonFormProps {
    showModal: boolean
    initValue?: TPersonInvolved | null
    onClose: () => void
}

const PersonForm = ({ showModal, initValue, onClose }: PersonFormProps) => {
    const documentTypes = EnumToStringArray(DocumentTypes)
    const areaCodes = EnumToStringArray(AreaCodes)
    const genders = EnumToStringArray(Genders)
    const units = []

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitted },
        reset,
    } = useForm<TPersonInvolved>({
        resolver: zodResolver(PersonInvolvedSchema),
        defaultValues: initValue != null ? initValue : {},
    })

    async function handleSubmitInternal(data: FieldValues) {
        await new Promise((resolve) => setTimeout(() => {}, 1000))
        if (true) {
            reset()
        }
    }

    return (
        <>
            <ModalContainer
                showX={false}
                downStikyChildren={''}
                show={showModal}
                onClose={() => onClose()}
                title="Registro de Persona Involucrada"
            >
                <form
                    className="mx-auto my-5 w-full max-w-[500px] md:max-w-[100%]"
                    onSubmit={handleSubmit(handleSubmitInternal)}
                    noValidate
                >
                    <div className="md:flex md:md:items-start md:space-x-2">
                        <Input2
                            description={'Condición'}
                            key={'condition'}
                            register={register}
                            rules={requiredRule}
                            isSubmitted={isSubmitted}
                            errors={errors.condition?.message}
                        />

                        <div className="w-44">
                            <Select2
                                description={'Vehiculo de Traslado'}
                                options={units}
                                isSubmitted={isSubmitted}
                                onChange={(newValue) =>
                                    setValue('unitId', newValue)
                                }
                            />
                        </div>
                    </div>

                    <FormTitle title="Datos de la persona" />

                    <div className="w-full space-y-3 px-2 max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <Input2
                                description={'Nombre'}
                                key={'firstName'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.firstName?.message}
                            />

                            <Input2
                                description={'Apellido'}
                                key={'lastName'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.lastName?.message}
                            />

                            <div className=" w-96">
                                <Select2
                                    description={'Genero'}
                                    options={genders}
                                    isSubmitted={isSubmitted}
                                    onChange={(newValue) =>
                                        setValue('gender', newValue)
                                    }
                                />
                            </div>

                            <Input2
                                description={'Edad'}
                                key={'age'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.age?.message}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <div className="w-full">
                                <div className="w-44">
                                    <Select2
                                        description={'Tipo de Documento'}
                                        options={documentTypes}
                                        isSubmitted={isSubmitted}
                                        onChange={(newValue) =>
                                            setValue('idDocumentType', newValue)
                                        }
                                    />
                                </div>

                                <Input2
                                    description={'Documento de Identidad'}
                                    key={'idDocument'}
                                    register={register}
                                    rules={requiredRule}
                                    isSubmitted={isSubmitted}
                                    errors={errors.idDocument?.message}
                                />
                            </div>

                            <div className="w-44">
                                <Select2
                                    description={'Código'}
                                    options={areaCodes}
                                    isSubmitted={isSubmitted}
                                    onChange={(newValue) =>
                                        setValue(
                                            'phoneNumberAreaCode',
                                            newValue
                                        )
                                    }
                                />
                            </div>

                            <Input2
                                description={'Número de Teléfono'}
                                key={'phoneNumber'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.phoneNumber?.message}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <Input2
                                description={'Estado'}
                                key={'employmentStatus'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.employmentStatus?.message}
                            />

                            <Input2
                                description={'Patología'}
                                key={'pathology'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.pathology?.message}
                            />
                        </div>

                        <div className="h-4"></div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <Input2
                                description={'Observaciones'}
                                key={'observations'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.observations?.message}
                            />
                        </div>
                    </div>

                    <div className="h-8"></div>

                    <FormTitle title="Dirección de Domicilio" />

                    <div className="w-full space-y-3 px-2 max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <Input2
                                description={'Estado'}
                                key={'state'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.state?.message}
                            />

                            <Input2
                                description={'Municipio'}
                                key={'municipality'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.municipality?.message}
                            />

                            <Input2
                                description={'Parroquia'}
                                key={'parish'}
                                register={register}
                                rules={requiredRule}
                                isSubmitted={isSubmitted}
                                errors={errors.parish?.message}
                            />
                        </div>

                        <Input2
                            description={'Dirección'}
                            key={'description'}
                            register={register}
                            rules={requiredRule}
                            isSubmitted={isSubmitted}
                            errors={errors.description?.message}
                        />
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

export default PersonForm
