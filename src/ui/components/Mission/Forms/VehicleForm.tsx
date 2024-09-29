import { FieldValues } from 'react-hook-form'
import React, { useEffect, useMemo, useState } from 'react'

import FormTitle from '../../../core/titles/FormTitle'
import Button from '../../../core/buttons/Button'

import {
    TVehicleInvolved,
    VehicleInvolvedSchema,
} from '../../../../domain/models/vehicle/vehicle_involved'
import { EnumToStringArray } from '../../../../utilities/converters/enum_converter'
import { AreaCodes } from '../../../../domain/abstractions/enums/area_codes.ts'

import CustomForm from '../../../core/context/CustomFormContext.tsx'
import FormSelect from '../../../core/inputs/FormSelect.tsx'

import { vehicleCrud } from '../../../../domain/models/vehicle/vehicle_involved'

import LoadingModal from '../../../core/modal/LoadingModal'
import ModalLayout from '../../../core/layouts/modal_layout.tsx'
import { modalService } from '../../../core/overlay/overlay_service.tsx'
import { ResultErr } from '../../../../domain/abstractions/types/resulterr.ts'
import { UnitTypes } from '../../../../domain/abstractions/enums/unit_types.ts'
import { get, getAll, post } from '../../../../services/http.tsx'
import FormSelectSearch from '../../../core/inputs/FormSelectSearch.tsx'
import { Colors } from '../../../../domain/abstractions/colors/colors.ts'
import FormSelectWithSearch from '../../../alter/components/form_inputs/form_select_with_search.tsx'
import FormInput from '../../../alter/components/form_inputs/form_input.tsx'
import Form from '../../../alter/components/form/form.tsx'

interface VehicleFormProps {
    serviceId: string
    initValue?: TVehicleInvolved | null
    onClose?: (success: boolean) => void
    closeOverlay?: () => void
    add?: boolean
}

const VehicleForm = ({
    serviceId,
    initValue,
    onClose,
    closeOverlay,
    add = true,
}: VehicleFormProps) => {
    const [loading, setLoading] = useState(false)
    const [brands, setBrands] = useState<string[]>([])
    const [models, setModels] = useState<string[]>([])

    const [selectedBrand, setSelectedBrand] = useState(
        initValue ? initValue.brand : ''
    )

    useEffect(() => {
        if (initValue) {
            const getBrands = async () => {
                const result = await get<any>('vehicles/types')
                if (result.success) return setBrands(result.result)
                return []
            }

            const models = async () => {
                const result = await getModels(selectedBrand)
                if (result.length > 0) {
                    const options = result.map((x) => (x as any).model)
                    setModels(options)
                } else setModels(result)
            }
            models()
            getBrands()
        } else {
            const getBrands = async () => {
                const result = await get<any>('vehicles/types')
                if (result.success) return setBrands(result.result)
                return []
            }
            getBrands()
        }
    }, [])

    useEffect(() => {
        const models = async () => {
            const result = await getModels(selectedBrand)
            if (result.length > 0) {
                const options = result.map((x) => (x as any).model)
                setModels(options)
            } else setModels(result)
        }
        models()
    }, [selectedBrand])

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

    console.log(
        'brands',
        initValue,
        typeof brands,
        brands.length > 0 && brands[0],
        brands.length > 0 && typeof brands[0]
    )

    // useEffect(() => {
    //     const marcaSeleccionada = brands != null && brands != "";

    //     if (!marcaSeleccionada) {
    //         setModelo("");
    //     }

    //     if (marcaSeleccionada && carsCache.current.has(marca)) {
    //         const getModels = carsCache.current.get(marca);
    //         setModels(getModels);
    //         setModelo(getModels[0] ?? "");
    //         return;
    //     }

    //     post("vehicles/types", { "model": marca }).then(r => {

    //         const modelsResult = r.data?.map(v => v.model);

    //         carsCache.current.set(marca, modelsResult);

    //         setModelos(modelsResult);
    //         setModelo(modelsResult[0] ?? "");
    //     })

    // }, [marca])

    const areaCodes = EnumToStringArray(AreaCodes)
    const buttonText = initValue ? 'Actualizar' : 'Guardar'

    const unitTypes = useMemo(() => EnumToStringArray(UnitTypes), [])

    async function handleSubmitInternal(data: FieldValues) {
        setLoading(true)

        try {
            const parsed = VehicleInvolvedSchema.parse(data)

            var result: ResultErr<TVehicleInvolved>

            if (add) result = await vehicleCrud.insert(parsed)
            else result = await vehicleCrud.update(parsed)

            if (result.success) {
                modalService.toastSuccess(
                    `Vehiculo ${buttonText.replace('dar', 'dado')}`
                )
                handleClose()
            } else
                modalService.toastError(
                    `No se pudo guardar el vehiculo por: ${result.result}`
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

    return (
        <>
            <ModalLayout title={'Registro de Vehiculo'} onClose={handleClose}>
                <Form
                    schema={VehicleInvolvedSchema}
                    initValue={{ ...initValue, serviceId: serviceId }}
                    onSubmit={handleSubmitInternal}
                >
                    <FormTitle title="Datos del Vehiculo" />

                    <div className="w-full space-y-3 px-2 max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormSelectWithSearch<TVehicleInvolved, string>
                                description={'Tipo'}
                                fieldName={'type'}
                                options={unitTypes}
                            />

                            <FormSelectWithSearch<TVehicleInvolved, string>
                                description={'Marca'}
                                fieldName={'brand'}
                                options={getBrands}
                                selectionChange={(e) => setSelectedBrand(e)}
                            />

                            <FormSelectWithSearch<TVehicleInvolved, string>
                                description={'Modelo'}
                                fieldName={'model'}
                                options={models}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TVehicleInvolved>
                                description="Placa"
                                fieldName={'licensePlate'}
                            />

                            <FormInput<TVehicleInvolved>
                                description="Año"
                                fieldName={'year'}
                            />

                            <FormSelectWithSearch<TVehicleInvolved, string>
                                description={'Color'}
                                fieldName={'color'}
                                options={Colors}
                            />
                        </div>
                        <div className="h-4"></div>
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <FormInput<TVehicleInvolved>
                                description="Condición"
                                fieldName={'condition'}
                            />
                        </div>
                    </div>
                    <div className="h-8"></div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-end space-x-8">
                            <Button
                                colorType="bg-[#3C50E0]"
                                onClick={() => { }}
                                children={buttonText}
                            ></Button>
                        </div>
                    </div>
                </Form>
            </ModalLayout>

            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}

export default VehicleForm
