import React, { useEffect, useMemo, useState } from "react"

import { ApiMissionAuthorityPersonSchema, ApiMissionAuthorityPersonType, missionAuthorityPersonCrud } from "../../../../domain/models/authority/authority_person"
import ModalLayout from '../../../optimized/components/layouts/modal_layout.tsx'
import LoadingModal from "../../../core/modal/LoadingModal"
import Button from "../../../core/buttons/Button"
import CustomForm from "../../../core/context/CustomFormContext"
import { modalService } from "../../../core/overlay/overlay_service"
import { FieldValues } from "react-hook-form"
import FormInput from "../../../alter/components/form_inputs/form_input"
import Form from "../../../alter/components/form/form"
import { EnumToStringArray } from "../../../../utilities/converters/enum_converter"
import { Genders } from "../../../../domain/abstractions/enums/genders"
import FormSelectWithSearch from "../../../alter/components/form_inputs/form_select_with_search"
import { ResultErr } from "../../../../domain/abstractions/types/resulterr"

interface Props {
    initValue?: ApiMissionAuthorityPersonType | null
    closeOverlay?: () => void
    add?: boolean
}

export function AuthorityPersonForm({ 
    initValue,
    closeOverlay,
    add = true,
}: Props) {
    const [isVisible, setIsVisible] = useState(true)
    const [loading, setLoading] = useState(false)

    const buttonText = initValue ? 'Actualizar' : 'Guardar'

    const genders = useMemo(() => EnumToStringArray(Genders), [])

    useEffect(() => {
        setLoading(false)
    }, [])

    console.log(initValue);


    async function handleSubmitInternal(data: ApiMissionAuthorityPersonType) {
        setLoading(true)

        try {
            let result: ResultErr<ApiMissionAuthorityPersonType>

            if (add) result = await missionAuthorityPersonCrud.insert(data)
            else result = await missionAuthorityPersonCrud.update(data)

            if (result.success) {
                modalService.toastSuccess(
                    `Vehículo ${buttonText.replace('dar', 'dado')}`
                )
                closeOverlay?.()
            } else
                modalService.toastError(
                    `No se pudo guardar el vehículo por: ${result.result}`
                )
        } catch (error) {
            modalService.toastError(`Error inesperado por: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return <>
        <ModalLayout
            title={'Registro de la Misión'}
            isVisible={isVisible}
            onClosed={closeOverlay}
            className="min-w-[70vw]"
            onClose={() => {
                setIsVisible(false)
            }}
        >

            <Form
                schema={ApiMissionAuthorityPersonSchema as any}
                initValue={{ ...initValue, mission_id: initValue?.mission_id, authority_id: initValue?.authority_id } as any}
                onSubmit={handleSubmitInternal}
            >
                <div className="w-full space-y-3 px-2">
                    <div className="w-full md:flex md:md:items-start md:space-x-2">
                        <FormInput<ApiMissionAuthorityPersonType>
                            description="Nombre"
                            fieldName={'name'}
                        />

                        <FormInput<ApiMissionAuthorityPersonType>
                            description="Apellido"
                            fieldName={'last_name'}
                        />

                        <FormInput<ApiMissionAuthorityPersonType>
                            description="N° Identificación"
                            fieldName={'identification_number'}
                        />
                    </div>

                    <div className="w-full md:flex md:md:items-start md:space-x-2">
                        <FormInput<ApiMissionAuthorityPersonType>
                            description="Doc Identidad"
                            fieldName={'legal_id'}
                        />

                        <FormInput<ApiMissionAuthorityPersonType>
                            description="Teléfono"
                            fieldName={'phone'}
                        />

                        <FormSelectWithSearch<ApiMissionAuthorityPersonType, string>
                            description="Genero"
                            options={genders}
                            fieldName={"gender"}
                            fatherLoading={loading}
                        />
                    </div>
                </div>

                <div className="h-8 flex-none"></div>

                <div className="flex flex-col space-y-4">
                    <div className="flex justify-end space-x-8">
                        <Button
                            colorType="bg-[#3C50E0]"
                            children={buttonText}
                        ></Button>
                    </div>
                </div>
            </Form>

        </ModalLayout>
    </>
}