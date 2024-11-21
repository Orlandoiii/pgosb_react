import React, { useEffect, useMemo, useState } from "react"

import ModalLayout from '../../../optimized/components/layouts/modal_layout.tsx'
import Button from "../../../core/buttons/Button"
import { modalService } from "../../../core/overlay/overlay_service"
import { get, post } from "../../../../services/http"
import { EnumToStringArray } from "../../../../utilities/converters/enum_converter"
import { Colors } from "../../../../domain/abstractions/colors/colors"
import { ResultErr } from "../../../../domain/abstractions/types/resulterr"
import { VehicleTypes } from "../../../../domain/abstractions/enums/vehicle_type"
import { useMissionAuthorityPersonActions } from "../../../../domain/models/mission/authority_person/use_collection.ts"
import { useMissionAuthorityVehicleActions } from "../../../../domain/models/mission/authority_vehicle/use_collection.ts"
import { MissionAuthorityVehicleFront, MissionAuthorityVehicleFrontSchema } from "../../../../domain/models/mission/authority_vehicle/mission_authority_vehicle.ts"
import Form from "../../../optimized/components/form/form.tsx"
import FormSelectWithSearch from "../../../optimized/components/form_inputs/form_select_with_search.tsx"
import FormInput from "../../../optimized/components/form_inputs/form_input.tsx"
import FormSubmit from "../../../optimized/components/form_inputs/form_submit.tsx"

interface Props {
    initValue?: MissionAuthorityVehicleFront | null
    closeOverlay?: () => void
    add?: boolean
}

export function AuthorityVehicleForm({
    initValue,
    closeOverlay,
    add = true,
}: Props) {
    const authorityVehicleActions = useMissionAuthorityVehicleActions();
    const [isVisible, setIsVisible] = useState(true)
    const [loading, setLoading] = useState(false)

    const [brands, setBrands] = useState<string[]>([])
    const [models, setModels] = useState<string[]>([])

    useEffect(() => {
        onLoad()
    }, [])

    async function onLoad() {
        console.log("here");
        try {
            if (initValue) {
                const getBrands = async () => {
                    const result = await get<any>('vehicles/types')
                    if (result.success) return setBrands(result.result)
                    return []
                }

                const models = async () => {
                    const result = await getModels(initValue ? initValue.make : "")
                    if (result.length > 0) {
                        const options = result.map((x) => (x as any).model)
                        setModels(options)
                    } else setModels(result)
                }
                await models()
                await getBrands()
            } else {
                const getBrands = async () => {
                    const result = await get<any>('vehicles/types')
                    if (result.success) return setBrands(result.result)
                    return []
                }
                await getBrands()
            }
        } finally {
            console.log("here");

            setLoading(false)
        }
    }

    console.log(loading);


    const buttonText = initValue ? 'Actualizar' : 'Guardar'
    const vehicleTypes = useMemo(() => EnumToStringArray(VehicleTypes), [])

    async function updateModels(brand: string) {
        const result = await getModels(brand)
        if (result.length > 0) {
            const options = result.map((x) => (x as any).model)
            setModels(options)
        } else setModels(result)
    }

    async function getBrands(): Promise<string[]> {
        const result = await get<any>('vehicles/types')
        if (result.success) return result.result
        return []
    }

    async function getModels(selectedBrandInternal: string): Promise<string[]> {
        const response = await post<any>('vehicles/types', {
            model: selectedBrandInternal,
        })
        if (response.success) return response.result
        return []
    }


    async function handleSubmitInternal(data: MissionAuthorityVehicleFront) {
        try {
            let result: ResultErr<MissionAuthorityVehicleFront>

            if (add) result = await authorityVehicleActions.insertFront(data)
            else result = await authorityVehicleActions.updateFront(data)

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

        }
    }

    return <>
        <ModalLayout
            title={'Registro de Vehiculo'}
            isVisible={isVisible}
            onClosed={closeOverlay}
            className="min-w-[70vw]"
            onClose={() => {
                setIsVisible(false)
            }}
        >

            <Form
                schema={MissionAuthorityVehicleFrontSchema as any}
                initValue={{ ...initValue, mission_id: initValue?.missionId, authority_id: initValue?.authorityId } as any}
                onSubmit={handleSubmitInternal}
            >
                <div className="w-full space-y-3 px-2">
                    <div className="w-full md:flex md:md:items-start md:space-x-2">
                        <FormSelectWithSearch<MissionAuthorityVehicleFront, string>
                            description="Tipo"
                            options={vehicleTypes}
                            fieldName={'type'}
                            fatherLoading={loading}
                            selectionChange={(e) => { updateModels(e) }}
                        />

                        <FormSelectWithSearch<MissionAuthorityVehicleFront, string>
                            description="Marca"
                            allowNewValue={true}
                            options={brands}
                            fieldName={"make"}
                            fatherLoading={loading}
                            selectionChange={(e) => { updateModels(e) }}
                        />

                        <FormSelectWithSearch<MissionAuthorityVehicleFront, string>
                            description="Modelo"
                            allowNewValue={true}
                            options={models}
                            fieldName={"model"}
                            fatherLoading={loading}
                            selectionChange={(e) => { }}
                        />
                    </div>

                    <div className="w-full md:flex md:md:items-start md:space-x-2">
                        <FormInput<MissionAuthorityVehicleFront>
                            description="Placa"
                            fieldName={'plate'}
                        />

                        <FormInput<MissionAuthorityVehicleFront>
                            description="Año"
                            fieldName={'year'}
                            type={'Integer'}
                        />

                        <FormSelectWithSearch<MissionAuthorityVehicleFront, string>
                            description="Color"
                            allowNewValue={true}
                            options={Colors}
                            fieldName={"color"}
                            fatherLoading={loading}
                            selectionChange={(e) => { }}
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
        {/* <LoadingModal initOpen={loading} children={null} /> */}
    </>
}