import { FieldValues } from 'react-hook-form'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import Button from '../../../core/buttons/Button.tsx'

import CustomForm, {
    getDefaults,
} from '../../../core/context/CustomFormContext.tsx'

import LoadingModal from '../../../core/modal/LoadingModal.tsx'
import { modalService } from '../../../core/overlay/overlay_service.tsx'
import { ResultErr } from '../../../../domain/abstractions/types/resulterr.ts'
import { useLocation } from '../../../core/hooks/useLocation.tsx'

import ModalLayout from '../../../optimized/components/layouts/modal_layout.tsx'
import { useStationCollection } from '../../../../domain/models/mission/station/use_collection.ts'
import { useHealthCareCenterCollection } from '../../../../domain/models/mission/health_care_center/use_collection.ts'
import { useMissionLocationActions, useMissionLocationCollection } from '../../../../domain/models/mission/location/use_collection.ts'
import Form from '../../../optimized/components/form/form.tsx'
import { SelectWithSearch } from '../../../optimized/components/inputs/select_with_search.tsx'
import TextInput from '../../../optimized/components/inputs/text_input.tsx'
import FormSubmit from '../../../optimized/components/form_inputs/form_submit.tsx'
import { MissionLocationFront, MissionLocationFrontSchema } from '../../../../domain/models/mission/location/mission_location.ts'


interface LocationFormProps {
    initValue?: MissionLocationFront | null
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

export default function LocationForm({
    initValue,
    closeOverlay,
    add = true,
}: LocationFormProps) {
    const locationActions = useMissionLocationActions();
    const [healthCareCenters] = useHealthCareCenterCollection();
    const [stations] = useStationCollection();

    const staticLocations = useMemo<StaticLocation[]>(() => stations.length > 0 && healthCareCenters.length > 0 ? [
        ...StationsAsStaticLocation(),
        ...CareCenterAsStaticLocation(),
    ] : [], [stations, healthCareCenters])
    function StationsAsStaticLocation(): StaticLocation[] {
        const newStaticLocations: StaticLocation[] = []

        stations.forEach(station => {
            newStaticLocations.push(
                {
                    display: `${station?.abbreviation ?? ""} - ${station?.description ?? ""}`,
                    ...station
                }
            )
        });

        return newStaticLocations
    }
    function CareCenterAsStaticLocation(): StaticLocation[] {
        const newStaticLocations: StaticLocation[] = []

        healthCareCenters.forEach(careCenter => {
            newStaticLocations.push(
                {
                    display: `${careCenter?.id ?? ""} - ${careCenter?.name ?? ""}`,
                    ...careCenter
                }
            )
        });

        return newStaticLocations
    }

    console.log(stations);


    const [isVisible, setIsVisible] = useState(true)
    const [loading, setLoading] = useState(!add)

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

    const [address, setAddress] = useState(initValue ? initValue?.address : '')


    const submitButtonRef = useRef<any>(null);

    useEffect(() => {
        if (alias && staticLocations.length > 0) {
            const staticLocation = staticLocations.filter(x => x.display === alias)[0]

            if (staticLocation) {

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

    }, [alias, staticLocations])

    console.log(parishs.length);


    const buttonText = add ? 'Guardar' : 'Actualizar'

    async function handleSubmitInternal(data: FieldValues) {
        console.log("here", data);
        try {
            const defaultValue = getDefaults<MissionLocationFront>(
                MissionLocationFrontSchema
            )




            defaultValue.address = address
            defaultValue.state = state
            defaultValue.stateId = String(estadoId)
            defaultValue.municipality = municipality
            defaultValue.municipalityId = String(municipioId)
            defaultValue.parish = parish
            defaultValue.parishId = String(parroquiaId)
            defaultValue.sector = sector
            defaultValue.sectorId = String(sectorId)
            defaultValue.urb = urbanizacion
            defaultValue.urbId = String(urbanizationId)
            defaultValue.alias = alias
            defaultValue.missionId = initValue?.id

            defaultValue.missionId = initValue?.missionId
            if (initValue?.id) defaultValue.id = initValue?.id

            let result: ResultErr<MissionLocationFront>
            console.log('Result', defaultValue)

            if (add) result = await locationActions.insertFront(defaultValue)
            else result = await locationActions.updateFront(defaultValue)

            if (result.success) {
                modalService.toastSuccess(
                    `Ubicación ${buttonText.replace('dar', 'dada')}`
                )
                closeOverlay?.()
            } else
                modalService.toastError(
                    `No se pudo guardar la ubicación por: ${result.result}`
                )
        } catch (error) {
            modalService.toastError(`Error inesperado por: ${error.message}`)
        } finally {

        }
    }

    return (
        <>
            <ModalLayout
                title={'Registro de Ubicación'}
                isVisible={isVisible}
                onClosed={closeOverlay}
                className="min-w-[54rem]"
                onClose={() => {
                    setIsVisible(false)
                }}
            >
                <Form
                    schema={MissionLocationFrontSchema}
                    initValue={{ ...initValue, missionId: initValue?.id }}
                    onSubmit={handleSubmitInternal}
                >
                    <div className="w-full space-y-3 px-2 max-w-[820px]">
                        <div className="md:flex md:md:items-start md:space-x-2">
                            <SelectWithSearch
                                description="Acceso directo a ubicaciones existentes"
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
                            <FormSubmit
                                enable={
                                    !(
                                        state == '' ||
                                        municipality == '' ||
                                        parish == '' ||
                                        sector == ''
                                    )

                                }
                                colorType="bg-[#3C50E0]"
                                description={buttonText}
                            />
                        </div>
                    </div>
                </Form>
            </ModalLayout>

            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}
