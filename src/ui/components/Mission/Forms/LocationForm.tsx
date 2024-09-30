import { FieldValues } from 'react-hook-form'
import React, { useEffect, useMemo, useState } from 'react'

import Button from '../../../core/buttons/Button.tsx'

import CustomForm, {
    getDefaults,
} from '../../../core/context/CustomFormContext.tsx'

import LoadingModal from '../../../core/modal/LoadingModal.tsx'
import ModalLayout from '../../../core/layouts/modal_layout.tsx'
import { modalService } from '../../../core/overlay/overlay_service.tsx'
import { ResultErr } from '../../../../domain/abstractions/types/resulterr.ts'
import { useLocation } from '../../../core/hooks/useLocation.tsx'
import {
    LocationCrud,
    ServiceLocationSchema,
    ServiceLocationSchemaType,
} from '../../../../domain/models/location/location.ts'
import { SelectWithSearch } from '../../../alter/components/inputs/select_with_search.tsx'
import TextInput from '../../../alter/components/inputs/text_input.tsx'
import { useCollection } from '../../../core/hooks/useCollection.ts'
import { ApiStationType } from '../../../../domain/models/stations/station.ts'
import { ApiHealthCareCenterType } from '../../../../domain/models/healthcare_center/healthcare_center.ts'
import FormInput from '../../../core/inputs/FormInput.tsx'

interface LocationFormProps {
    missionId: string
    initValue?: ServiceLocationSchemaType | null
    onClose?: (success: boolean) => void
    closeOverlay?: () => void
    add?: boolean
}


type StaticLocation = {
    display,
    state_id,
    state,
    municipality_id,
    municipality,
    parish_id,
    parish,
    sector_id,
    sector,
    urb_id,
    urb,
    street,
    address,
}


const LocationForm = ({
    missionId,
    initValue,
    onClose,
    closeOverlay,
    add = true,
}: LocationFormProps) => {
    const stationCollection = useCollection<ApiStationType>('station', (data: any) => {
        return { success: true, result: data }
    })
    const careCenterCollection = useCollection<ApiHealthCareCenterType>('center', (data: any) => {
        return { success: true, result: data }
    })

    const [alias, setAlias] = useState(initValue ? initValue?.alias : '')
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

        urbanizaciones,
        urbanizacion,
        urbanizationId,
        setUrbanizacion,
    } = useLocation(
        initValue?.state,
        initValue?.municipality,
        initValue?.parish,
        initValue?.sector,
        initValue?.urb
    )
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState(initValue ? initValue?.address : '')

    const staticLocations = useMemo(() => stationCollection.length > 0 && careCenterCollection.length > 0 ? [
        ...StationsAsStaticLocation(),
        ...CareCenterAsStaticLocation()
    ] : [], [stationCollection, careCenterCollection])

    function StationsAsStaticLocation(): StaticLocation[] {
        const newStaticLocations: StaticLocation[] = []

        stationCollection.forEach(element => {
            newStaticLocations.push(
                {
                    display: `${element.abbreviation} - ${element.description}`,
                    state_id: element.state_id,
                    state: element.state,
                    municipality_id: element.municipality_id,
                    municipality: element.municipality,
                    parish_id: element.parish_id,
                    parish: element.parish,
                    sector_id: element.sector_id,
                    sector: element.sector,
                    urb_id: element.urb_id,
                    urb: element.urb,
                    street: element.street,
                    address: element.address,
                }
            )
        });

        return newStaticLocations
    }
    function CareCenterAsStaticLocation(): StaticLocation[] {
        const newStaticLocations: StaticLocation[] = []

        careCenterCollection.forEach(element => {
            newStaticLocations.push(
                {
                    display: `${element.id} - ${element.name}`,
                    state_id: element.state_id,
                    state: element.state,
                    municipality_id: element.municipality_id,
                    municipality: element.municipality,
                    parish_id: element.parish_id,
                    parish: element.parish,
                    sector_id: element.sector_id,
                    sector: element.sector,
                    urb_id: element.urb_id,
                    urb: element.urb,
                    street: element.street,
                    address: element.address,
                }
            )
        });

        return newStaticLocations
    }

    useEffect(() => {
        if (alias && staticLocations.length > 0) {
            const staticLocation = staticLocations.filter(x => x.display === alias)[0]

            if (staticLocation) {
                setLoading(true)

                setState(staticLocation.state)
                setMunicipality(staticLocation.municipality)
                setParish(staticLocation.parish)
                setSector(staticLocation.sector)
                setUrbanizacion(staticLocation.urb)
                setAddress(staticLocation.address)

                setTimeout(() => {
                    setLoading(false)
                }, 1000);
            }
        }
    }, [alias])

    console.log(parishs.length);


    const buttonText = initValue ? 'Actualizar' : 'Guardar'

    async function handleSubmitInternal(data: FieldValues) {

        try {
            const defaultValue = getDefaults<ServiceLocationSchemaType>(
                ServiceLocationSchema
            )

            defaultValue.address = address
            defaultValue.state = state
            defaultValue.state_id = String(estadoId)
            defaultValue.municipality = municipality
            defaultValue.municipality_id = String(municipioId)
            defaultValue.parish = parish
            defaultValue.parish_id = String(parroquiaId)
            defaultValue.sector = sector
            defaultValue.sector_id = String(sectorId)
            defaultValue.urb = urbanizacion
            defaultValue.urb_id = String(urbanizationId)
            defaultValue.alias = alias
            defaultValue.mission_id = missionId

            if (!add) {
                defaultValue.mission_id = initValue?.mission_id
                defaultValue.id = initValue?.id
            }

            let result: ResultErr<ServiceLocationSchemaType>
            console.log('Result', defaultValue)

            if (add) result = await LocationCrud.insert(defaultValue)
            else result = await LocationCrud.update(defaultValue)

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
                            <SelectWithSearch
                                description="Ubicación estática"
                                options={staticLocations}
                                valueKey={'display'}
                                displayKeys={['display']}
                                selectionChange={(e) => {
                                    setAlias(e)
                                }}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <TextInput
                                description='Alias'
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}>

                            </TextInput>


                            <SelectWithSearch
                                isLoading={loading || (states?.length ?? 0) < 2}
                                description="Estado"
                                options={states}
                                selectedOption={state}
                                selectionChange={(e) => {
                                    setState(e)
                                    setMunicipality('')
                                    setParish('')
                                    setSector('')
                                    setUrbanizacion('')
                                }}
                            />

                            <SelectWithSearch
                                disable={state && state == ''}
                                isLoading={loading || (states?.length ?? 0) < 2}
                                description="Municipio"
                                options={municipalitys}
                                selectedOption={municipality}
                                selectionChange={(e) => {
                                    setMunicipality(e)
                                    setParish('')
                                    setSector('')
                                    setUrbanizacion('')
                                }}
                            />
                        </div>

                        <div className="md:flex md:md:items-start md:space-x-2">
                            <SelectWithSearch
                                disable={
                                    (state && state == '') ||
                                    (municipality && municipality == '')
                                }
                                isLoading={loading || (states?.length ?? 0) < 2}
                                description="Parroquia"
                                options={parishs}
                                selectedOption={parish}
                                selectionChange={(e) => {
                                    setParish(e)
                                    setSector('')
                                    setUrbanizacion('')
                                }}
                            />

                            <SelectWithSearch
                                disable={
                                    (state && state == '') ||
                                    (municipality && municipality == '') ||
                                    (parish && parish == '')
                                }
                                isLoading={loading || (states?.length ?? 0) < 2}
                                description="Sector"
                                options={sectores}
                                selectedOption={sector}
                                selectionChange={(e) => {
                                    setSector(e)
                                    setUrbanizacion('')
                                }}
                            />

                            <SelectWithSearch
                                disable={
                                    (state && state == '') ||
                                    (municipality && municipality == '') ||
                                    (parish && parish == '')
                                }
                                isLoading={loading || (states?.length ?? 0) < 2}
                                description="Urbanización"
                                options={urbanizaciones}
                                selectedOption={urbanizacion}
                                selectionChange={(e) => setUrbanizacion(e)}
                            />
                        </div>

                        <div className={` w-full`}>
                            <TextInput
                                description="Dirección"
                                value={address}
                                onChange={(e) =>
                                    setAddress(e.currentTarget.value)
                                }
                            ></TextInput>

                            {/* <TextArea
                                description="Dirección"
                                value={address}
                                onChange={(e) => {
                                    console.log('aksjdhsjkadh', e)

                                    setAddress(e.currentTarget.value)
                                }}
                            ></TextArea> */}
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
