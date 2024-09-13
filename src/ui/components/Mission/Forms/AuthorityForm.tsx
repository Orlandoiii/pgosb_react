import { FieldValues, useForm } from 'react-hook-form'
import React, { useState } from 'react'

import {
    TAuthority,
    AuthoritySchema,
} from '../../../../domain/models/authority/authority'
import FormTitle from '../../../core/titles/FormTitle'

import Button from '../../../core/buttons/Button'
import ModalLayout from '../../../core/layouts/modal_layout'
import CustomForm from '../../../core/context/CustomFormContext'
import FormInput from '../../../core/inputs/FormInput.tsx'
import FormSelect from '../../../core/inputs/FormSelect.tsx'


const AuthorityTypes = [
    'POLICE',
    'FIRE',
    'AMBULANCE',
    'OTHER'
]

interface AuthorityFormProps {
    serviceId: string
    initValue?: TAuthority | null
    onClose?: (success: boolean) => void
    closeOverlay?: () => void
    add?: boolean
}


const AuthorityForm = ({
    serviceId,
    initValue,
    onClose,
    closeOverlay,
    add = true
}: AuthorityFormProps) => {


    async function handleSubmitInternal(data: FieldValues) {

    }

    function handleClose() {
        if (closeOverlay) closeOverlay()
        if (onClose) onClose(false)
    }

    return (
        <>
            <ModalLayout
                title={'Registro de Infrastructura'}
                onClose={handleClose}
            >
                <CustomForm
                    schema={AuthoritySchema}
                    initValue={{ ...initValue, serviceId: serviceId }}
                    onSubmit={handleSubmitInternal}
                >


                    <FormTitle title="Datos de la Autoridad u Organización" />

                    <div className="space-y-3 px-2 w-full max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormSelect<TAuthority>
                                fieldName={'type'}
                                description={'Tipo de infrastructura:'}
                                options={AuthorityTypes}
                            />

                            <FormInput<TAuthority>
                                fieldName={'name'}
                                description="Nombre:"
                            />


                            <FormInput<TAuthority>
                                fieldName={'last_name'}
                                description="Apellido:"
                            />

                            <FormInput<TAuthority>
                                fieldName={'identification'}
                                description="Nro. Identificación:"
                            />

                            <FormInput<TAuthority>
                                fieldName={'rank'}
                                description="Rango o Cargo:"
                            />

                            <FormInput<TAuthority>
                                fieldName={'phone'}
                                description="Teléfono:"
                            />

                            <FormInput<TAuthority>
                                fieldName={'vehicles'}
                                description="Vehículos:"
                            />

                            <FormInput<TAuthority>
                                fieldName={'details_vehicles'}
                                description="Detalles de los vehículos:"
                            />

                        </div>

                    </div>
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-end space-x-8">
                            <Button
                                colorType="bg-[#3C50E0]"
                                onClick={(e) => { }}
                                children={'Aceptar'}
                            ></Button>
                        </div>
                    </div>

                </CustomForm>
            </ModalLayout>
        </>
    )
}

export default AuthorityForm
