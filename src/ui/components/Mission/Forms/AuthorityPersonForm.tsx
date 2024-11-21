import React, { useEffect, useMemo, useState } from "react"

import ModalLayout from '../../../optimized/components/layouts/modal_layout.tsx'
import LoadingModal from "../../../core/modal/LoadingModal"
import Button from "../../../core/buttons/Button"
import CustomForm from "../../../core/context/CustomFormContext"
import { modalService } from "../../../core/overlay/overlay_service"
import { FieldValues } from "react-hook-form"
import { EnumToStringArray } from "../../../../utilities/converters/enum_converter"
import { Genders } from "../../../../domain/abstractions/enums/genders"
import { ResultErr } from "../../../../domain/abstractions/types/resulterr"
import { useMissionAuthorityPersonActions } from "../../../../domain/models/mission/authority_person/use_collection.ts"
import { MissionAuthorityPersonFront, MissionAuthorityPersonFrontSchema } from "../../../../domain/models/mission/authority_person/mission_authority_person.ts"
import Form from "../../../optimized/components/form/form.tsx"
import FormInput from "../../../optimized/components/form_inputs/form_input.tsx"
import FormSelectWithSearch from "../../../optimized/components/form_inputs/form_select_with_search.tsx"
import FormSubmit from "../../../optimized/components/form_inputs/form_submit.tsx"

interface Props {
    initValue?: MissionAuthorityPersonFront | null
    closeOverlay?: () => void
    add?: boolean
}

export function AuthorityPersonForm({
    initValue,
    closeOverlay,
    add = true,
}: Props) {
    const authorityPersonActions = useMissionAuthorityPersonActions();
    const [isVisible, setIsVisible] = useState(true)
    const [loading, setLoading] = useState(false)

    const buttonText = initValue ? 'Actualizar' : 'Guardar'

    const genders = useMemo(() => EnumToStringArray(Genders), [])

    useEffect(() => {
        setLoading(false)
    }, [])

    console.log(initValue);


    async function handleSubmitInternal(data: MissionAuthorityPersonFront) {
        setLoading(true)

        try {
            let result: ResultErr<MissionAuthorityPersonFront>

            if (add) result = await authorityPersonActions.insertFront(data)
            else result = await authorityPersonActions.updateFront(data)

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
                schema={MissionAuthorityPersonFrontSchema as any}
                initValue={{ ...initValue, mission_id: initValue?.missionId, authority_id: initValue?.authorityId } as any}
                onSubmit={handleSubmitInternal}
            >
                <div className="w-full space-y-3 px-2">
                    <div className="w-full md:flex md:md:items-start md:space-x-2">
                        <FormInput<MissionAuthorityPersonFront>
                            description="Nombre"
                            fieldName={'name'}
                        />

                        <FormInput<MissionAuthorityPersonFront>
                            description="Apellido"
                            fieldName={'lastName'}
                        />

                        <FormInput<MissionAuthorityPersonFront>
                            description="N° Identificación"
                            fieldName={'identificationNumber'}
                        />
                    </div>

                    <div className="w-full md:flex md:md:items-start md:space-x-2">
                        <FormInput<MissionAuthorityPersonFront>
                            description="Doc Identidad"
                            fieldName={'legalId'}
                        />

                        <FormInput<MissionAuthorityPersonFront>
                            description="Teléfono"
                            fieldName={'phone'}
                        />

                        <FormSelectWithSearch<MissionAuthorityPersonFront, string>
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
                        <FormSubmit
                            colorType="bg-[#3C50E0]"
                            description={'Aceptar'}
                        />
                    </div>
                </div>
            </Form>

        </ModalLayout>
    </>
}