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
import {
    LocationCrud,
    LocationSchemaType,
    ServiceLocationSchema,
    ServiceLocationSchemaType,
} from '../../../../domain/models/location/location.ts'
import { SelectWithSearch } from '../../../alter/components/inputs/select_with_search.tsx'
import TextInput from '../../../alter/components/inputs/text_input.tsx'
import TextArea from '../../../alter/components/inputs/text_area.tsx'
import { useActionModalAndCollection } from '../../../core/hooks/useActionModalAndCollection.ts'

interface LocationFormProps {
    missionId: string
    initValue?: ServiceLocationSchemaType | null
    onClose?: (success: boolean) => void
    closeOverlay?: () => void
    add?: boolean
}

const LocationForm = ({
    missionId,
    initValue,
    onClose,
    closeOverlay,
    add = true,
}: LocationFormProps) => {
    const [alias, setAlias] = useState('')
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
        initValue?.sector,
        initValue?.urb
    )
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState(initValue ? initValue?.address : '')



    const buttonText = initValue ? 'Actualizar' : 'Guardar'

    async function handleSubmitInternal(data: FieldValues) {
        setLoading(true)

        try {
            const parsed = ServiceLocationSchema.parse(data)

            var result: ResultErr<ServiceLocationSchemaType>

            if (add) result = await LocationCrud.insert(parsed)
            else result = await LocationCrud.update(parsed)

            if (result.success) {
                modalService.toastSuccess(
                    `Ubicación ${buttonText.replace('dar', 'dada')}`
                )
                handleClose()
            } else
                modalService.toastError(
                    `No se pudo guardar la ubicación por: ${result.result}`
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
            <ModalLayout
                title={'Registro de Ubicación'}
                onClose={handleClose}
                className="max-h-[90vh] min-w-[54rem] max-w-[85vw]"
            >
                <CustomForm
                    schema={ServiceLocationSchema}
                    initValue={{ ...initValue, missionId: missionId }}
                    onSubmit={handleSubmitInternal}
                >
                    <div className="w-full space-y-3 px-2 max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <TextInput
                                description="Alias"
                                value={alias}
                                onChange={(e) =>
                                    setAlias(e.currentTarget.value)
                                }
                            ></TextInput>
                            <SelectWithSearch
                                description="Estado"
                                options={states}
                                selectedOption={state}
                                selectionChange={(e) => setState(e)}
                            />

                            <SelectWithSearch
                                disable={state && state == ''}
                                description="Municipio"
                                options={municipalitys}
                                selectedOption={municipality}
                                selectionChange={(e) => setMunicipality(e)}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <SelectWithSearch
                                disable={
                                    (state && state == '') ||
                                    (municipality && municipality == '')
                                }
                                description="Parroquia"
                                options={parishs}
                                selectedOption={parish}
                                selectionChange={(e) => setParish(e)}
                            />

                            <SelectWithSearch
                                disable={
                                    (state && state == '') ||
                                    (municipality && municipality == '') ||
                                    (parish && parish == '')
                                }
                                description="Sector"
                                options={sectores}
                                selectedOption={sector}
                                selectionChange={(e) => setSector(e)}
                            />
                        </div>

                        <div className={`h-40 w-full`}>
                            <TextArea
                                description="Dirección"
                                value={address}
                                onChange={(e) =>
                                    setAddress(e.currentTarget.value)
                                }
                            ></TextArea>
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
