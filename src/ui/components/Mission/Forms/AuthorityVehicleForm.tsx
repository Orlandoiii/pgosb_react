import React, { useEffect, useMemo, useState } from "react"

import { ApiMissionAuthorityVehicleSchema, ApiMissionAuthorityVehicleType, missionAuthorityVehicleCrud } from "../../../../domain/models/authority/authority_vehicle"
import ModalLayout from '../../../optimized/components/layouts/modal_layout.tsx'
import FormInput from "../../../alter/components/form_inputs/form_input"
import Button from "../../../core/buttons/Button"
import { modalService } from "../../../core/overlay/overlay_service"
import Form from "../../../alter/components/form/form"
import { get, post } from "../../../../services/http"
import FormSelectWithSearch from "../../../alter/components/form_inputs/form_select_with_search"
import { EnumToStringArray } from "../../../../utilities/converters/enum_converter"
import { Colors } from "../../../../domain/abstractions/colors/colors"
import { ResultErr } from "../../../../domain/abstractions/types/resulterr"
import { VehicleTypes } from "../../../../domain/abstractions/enums/vehicle_type"
import { useMissionAuthorityPersonActions } from "../../../../domain/models/mission/authority_person/use_collection.ts"
import { useMissionAuthorityVehicleActions } from "../../../../domain/models/mission/authority_vehicle/use_collection.ts"
import { MissionAuthorityVehicleFront } from "../../../../domain/models/mission/authority_vehicle/mission_authority_vehicle.ts"

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
    const infrastructureActions = useMissionAuthorityVehicleActions();
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


    async function handleSubmitInternal(data: ApiMissionAuthorityVehicleType) {
        try {
            let result: ResultErr<ApiMissionAuthorityVehicleType>

            if (add) result = await missionAuthorityVehicleCrud.insert(data)
            else result = await missionAuthorityVehicleCrud.update(data)

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
                schema={ApiMissionAuthorityVehicleSchema as any}
                initValue={{ ...initValue, mission_id: initValue?.mission_id, authority_id: initValue?.authority_id } as any}
                onSubmit={handleSubmitInternal}
            >
                <div className="w-full space-y-3 px-2">
                    <div className="w-full md:flex md:md:items-start md:space-x-2">
                        <FormSelectWithSearch<ApiMissionAuthorityVehicleType, string>
                            description="Tipo"
                            options={vehicleTypes}
                            fieldName={'type'}
                            fatherLoading={loading}
                            selectionChange={(e) => { updateModels(e) }}
                        />

                        <FormSelectWithSearch<ApiMissionAuthorityVehicleType, string>
                            description="Marca"
                            allowNewValue={true}
                            options={brands}
                            fieldName={"make"}
                            fatherLoading={loading}
                            selectionChange={(e) => { updateModels(e) }}
                        />

                        <FormSelectWithSearch<ApiMissionAuthorityVehicleType, string>
                            description="Modelo"
                            allowNewValue={true}
                            options={models}
                            fieldName={"model"}
                            fatherLoading={loading}
                            selectionChange={(e) => { }}
                        />
                    </div>

                    <div className="w-full md:flex md:md:items-start md:space-x-2">
                        <FormInput<ApiMissionAuthorityVehicleType>
                            description="Placa"
                            fieldName={'plate'}
                        />

                        <FormInput<ApiMissionAuthorityVehicleType>
                            description="Año"
                            fieldName={'year'}
                            type={'Integer'}
                        />

                        <FormSelectWithSearch<ApiMissionAuthorityVehicleType, string>
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
                        <Button
                            colorType="bg-[#3C50E0]"
                            children={buttonText}
                        ></Button>
                    </div>
                </div>
            </Form>

        </ModalLayout>
        {/* <LoadingModal initOpen={loading} children={null} /> */}
    </>
}