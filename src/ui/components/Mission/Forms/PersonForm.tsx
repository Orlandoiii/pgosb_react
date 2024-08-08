import { FieldValues } from 'react-hook-form'
import React, { useState } from 'react'

import FormTitle from '../../../core/titles/FormTitle'
import Button from '../../../core/buttons/Button'

import {
    TPersonInvolved,
    PersonInvolvedSchema,
} from '../../../../domain/models/person/person_involved'
import { EnumToStringArray } from '../../../../utilities/converters/enum_converter'
import { AreaCodes } from '../../../../domain/abstractions/enums/area_codes'

import CustomForm from '../../../core/context/CustomFormContext.tsx'
import FormInput from '../../../core/inputs/FormInput.tsx'
import FormSelect from '../../../core/inputs/FormSelect.tsx'

import { personCrud } from '../../../../domain/models/person/person_involved'

import LoadingModal from '../../../core/modal/LoadingModal'

import { modalService } from '../../../core/overlay/overlay_service.tsx'
import ModalLayout from '../../../core/layouts/modal_layout.tsx'
import { ResultErr } from '../../../../domain/abstractions/types/resulterr.ts'
import { Genders } from '../../../../domain/abstractions/enums/genders.ts'
import { DocumentTypes } from '../../../../domain/abstractions/enums/document_types.ts'

interface PersonFormProps {
    serviceId: string
    initValue?: TPersonInvolved | null
    onClose?: (success: boolean) => void
    closeOverlay?: () => void
    add?: boolean
}

const PersonForm = ({
    serviceId,
    initValue,
    onClose,
    closeOverlay,
    add = true,
}: PersonFormProps) => {
    const [loading, setLoading] = useState(false)
    const areaCodes = EnumToStringArray(AreaCodes)
    const buttonText = initValue ? 'Actualizar' : 'Guardar'

    async function handleSubmitInternal(data: FieldValues) {
        setLoading(true)

        try {
            const parsed = PersonInvolvedSchema.parse(data)
            var result: ResultErr<TPersonInvolved>

            if (add) result = await personCrud.insert(parsed)
            else result = await personCrud.update(parsed)

            if (result.success) {
                modalService.pushAlert(
                    'Complete',
                    `Persona ${buttonText.replace('dar', 'dada')}`,
                    undefined,
                    closeOverlay
                )
                if (onClose) onClose(true)
            } else {
                modalService.pushAlert(
                    'Error',
                    `No se pudo guardar la Persona por: ${result.result}`
                )
            }
        } catch (error) {
            modalService.pushAlert(
                'Error',
                `Error inesperado por: ${error.message}`
            )
        } finally {
            setLoading(false)
        }
    }

    function handleClose() {
        if (closeOverlay) closeOverlay()
        if (onClose) onClose(false)
    }

    return (
        <>
            <ModalLayout title={'Registro de Persona'} onClose={handleClose}>
                <CustomForm
                    schema={PersonInvolvedSchema}
                    initValue={{ ...initValue, serviceId: serviceId }}
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
                                    options={EnumToStringArray(Genders)}
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
                                        options={EnumToStringArray(DocumentTypes)}
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
                                    options={EnumToStringArray(AreaCodes)}
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
                                children={buttonText}
                            ></Button>
                        </div>
                    </div>
                </CustomForm>
            </ModalLayout>

            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}

export default PersonForm
