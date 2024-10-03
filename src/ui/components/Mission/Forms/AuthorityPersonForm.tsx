import React, { useEffect, useMemo, useState } from "react"

import { ApiMissionAuthorityPersonSchema, ApiMissionAuthorityPersonType, missionAuthorityPersonCrud } from "../../../../domain/models/authority/authority_person"
import ModalLayout from "../../../core/layouts/modal_layout"
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
    missionId: string
    authorityId: string
    initValue?: ApiMissionAuthorityPersonType | null
    onClose?: (success: boolean) => void
    closeOverlay?: () => void
    add?: boolean
}

export function AuthorityPersonForm({ missionId, authorityId, initValue, onClose, closeOverlay, add }: Props) {
    const [loading, setLoading] = useState(true)
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
                handleClose()
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

    function handleClose() {
        if (closeOverlay) closeOverlay()
        if (onClose) onClose(false)
    }

    console.log(initValue?.gender);


    return <>
        <ModalLayout
            className="min-w-[70vw] max-w-[85vw]"
            title={'Registro de la Misión'}
            onClose={closeOverlay}
        >

            <Form
                schema={ApiMissionAuthorityPersonSchema as any}
                initValue={{ ...initValue, mission_id: missionId, authority_id: authorityId } as any}
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