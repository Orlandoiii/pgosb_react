import { FieldValues } from 'react-hook-form'
import React from 'react'

import FormTitle from '../../../core/titles/FormTitle'
import ModalContainer from '../../../core/modal/ModalContainer'
import { Genders } from '../../../../domain/abstractions/enums/genders'
import Button from '../../../core/buttons/Button'

import {
    TPersonInvolved,
    PersonInvolvedSchema,
} from '../../../../domain/models/person/person_involved'
import { EnumToStringArray } from '../../../../utilities/converters/enum_converter'
import { DocumentTypes } from '../../../../domain/abstractions/enums/document_types'
import { AreaCodes } from '../../../../domain/abstractions/enums/area_codes'

import CustomForm from '../../../core/context/CustomFormContext.tsx'
import FormInput from '../../../core/inputs/FormInput.tsx'
import FormSelect from '../../../core/inputs/FormSelect.tsx'
import FormSelectSearch from '../../../core/inputs/FormSelectSearch.tsx'
import FormToggle from '../../../core/inputs/FormToggle.tsx'

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

    async function handleSubmitInternal(data: FieldValues) {
        await new Promise((resolve) => setTimeout(() => {}, 1000))
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
                <CustomForm
                    schema={PersonInvolvedSchema}
                    initValue={initValue}
                    onSubmit={handleSubmitInternal}
                >
                    <div className="md:flex md:md:items-start md:space-x-2">
                        <FormInput<TPersonInvolved>
                            fieldName={'condition'}
                            description="Condición:"
                        />

                        <div className="w-44">
                            <FormSelect<TPersonInvolved>
                                fieldName={'unitId'}
                                description={'Vehiculo de Traslado:'}
                                options={areaCodes}
                            />
                        </div>
                    </div>

                    <FormTitle title="Datos de la persona" />

                    <div className="w-full space-y-3 px-2 max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TPersonInvolved>
                                fieldName={'firstName'}
                                description="Nombre:"
                            />

                            <FormInput<TPersonInvolved>
                                fieldName={'lastName'}
                                description="Apellido:"
                            />

                            <div className=" w-96">
                                <FormSelect<TPersonInvolved>
                                    fieldName={'gender'}
                                    description={'Genero:'}
                                    options={areaCodes}
                                />
                            </div>

                            <FormInput<TPersonInvolved>
                                fieldName={'age'}
                                description="Edad:"
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <div className="w-full">
                                <div className="w-44">
                                    <FormSelect<TPersonInvolved>
                                        fieldName={'idDocumentType'}
                                        description={'Tipo de Documento:'}
                                        options={areaCodes}
                                    />
                                </div>

                                <FormInput<TPersonInvolved>
                                    fieldName={'idDocument'}
                                    description="Documento de Identidad:"
                                />
                            </div>

                            <div className="w-44">
                                <FormSelect<TPersonInvolved>
                                    fieldName={'phoneNumberAreaCode'}
                                    description={'Código:'}
                                    options={areaCodes}
                                />
                            </div>

                            <FormInput<TPersonInvolved>
                                fieldName={'phoneNumber'}
                                description="Número de Teléfono:"
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TPersonInvolved>
                                fieldName={'employmentStatus'}
                                description="Estado:"
                            />

                            <FormInput<TPersonInvolved>
                                fieldName={'pathology'}
                                description="Patología:"
                            />
                        </div>

                        <div className="h-4"></div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TPersonInvolved>
                                fieldName={'observations'}
                                description="Observaciones:"
                            />
                        </div>
                    </div>

                    <div className="h-8"></div>

                    <FormTitle title="Dirección de Domicilio" />

                    <div className="w-full space-y-3 px-2 max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TPersonInvolved>
                                fieldName={'state'}
                                description="Estado:"
                            />

                            <FormInput<TPersonInvolved>
                                fieldName={'municipality'}
                                description="Municipio:"
                            />

                            <FormInput<TPersonInvolved>
                                fieldName={'parish'}
                                description="Parroquia:"
                            />
                        </div>

                        <FormInput<TPersonInvolved>
                            fieldName={'description'}
                            description="Dirección:"
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
                </CustomForm>
            </ModalContainer>
        </>
    )
}

export default PersonForm
