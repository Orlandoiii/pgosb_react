import { FieldValues } from 'react-hook-form'
import React, { useEffect, useState } from 'react'

import FormTitle from '../../../core/titles/FormTitle.tsx'
import Button from '../../../core/buttons/Button.tsx'

import {
    TVehicleInvolved,
    VehicleInvolvedSchema,
} from '../../../../domain/models/vehicle/vehicle_involved.ts'
import { EnumToStringArray } from '../../../../utilities/converters/enum_converter.tsx'
import { AreaCodes } from '../../../../domain/abstractions/enums/area_codes.ts'

import CustomForm from '../../../core/context/CustomFormContext.tsx'
import FormInput from '../../../core/inputs/FormInput.tsx'
import FormSelect from '../../../core/inputs/FormSelect.tsx'

import { vehicleCrud } from '../../../../domain/models/vehicle/vehicle_involved.ts'

import LoadingModal from '../../../core/modal/LoadingModal.tsx'
import ModalLayout from '../../../core/layouts/modal_layout.tsx'
import { modalService } from '../../../core/overlay/overlay_service.tsx'
import { ResultErr } from '../../../../domain/abstractions/types/resulterr.ts'
import { UnitTypes } from '../../../../domain/abstractions/enums/unit_types.ts'
import { get, getAll } from '../../../../services/http.tsx'
import FormSelectSearch from '../../../core/inputs/FormSelectSearch.tsx'
import { useLocation } from '../../../core/hooks/useLocation.tsx'
import { LocationSchemaType } from '../../../../domain/models/location/location.ts'
import { SelectWithSearch } from '../../../alter/components/inputs/select_with_search.tsx'

interface LocationFormProps {
    serviceId: string
    initValue?: LocationSchemaType | null
    onClose?: (success: boolean) => void
    closeOverlay?: () => void
    add?: boolean
}

const LocationForm = ({
    serviceId,
    initValue,
    onClose,
    closeOverlay,
    add = true,
}: LocationFormProps) => {
    const {
        states,
        state,
        setState,
        estadoId,

        municipalitys,
        municipality,
        municipioId,
        setMunicipality,

        parishs,
        parish,
        parroquiaId,
        setParish,

        sectores,
        sector,
        sectorId,
        setSector,
    } = useLocation(
        initValue?.state,
        initValue?.municipality,
        initValue?.parish,
        initValue?.sector
    )
    const [loading, setLoading] = useState(false)

    const buttonText = initValue ? 'Actualizar' : 'Guardar'

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
            <ModalLayout title={'Registro de Ubicación'} onClose={handleClose}>
                <CustomForm
                    schema={VehicleInvolvedSchema}
                    initValue={{ ...initValue, serviceId: serviceId }}
                    onSubmit={handleSubmitInternal}
                >
                    <div className="w-full space-y-3 px-2 max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <SelectWithSearch
                                description="Estado"
                                options={states}
                                selectedOption={state}
                                selectionChange={(e) => setState(e)}
                            />

                            <SelectWithSearch
                                disable={state || state == ''}
                                description="Municipio"
                                options={municipalitys}
                                selectedOption={municipality}
                                selectionChange={(e) => setMunicipality(e)}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <SelectWithSearch
                                disable={
                                    (state || state == '') &&
                                    (municipality || municipality == '')
                                }
                                description="Parroquia"
                                options={parishs}
                                selectedOption={parish}
                                selectionChange={(e) => setParish(e)}
                            />

                            <SelectWithSearch
                                disable={
                                    (state || state == '') &&
                                    (municipality || municipality == '') &&
                                    (parish || parish == '')
                                }
                                description="Sector"
                                options={sectores}
                                selectedOption={sector}
                                selectionChange={(e) => setSector(e)}
                            />
                        </div>
                    </div>
                    <div className="h-8"></div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-end space-x-8">
                            <Button
                                enable={
                                    !(
                                        state == '' ||
                                        municipality == '' ||
                                        parish == '' ||
                                        sector == ''
                                    )
                                }
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

export default LocationForm
