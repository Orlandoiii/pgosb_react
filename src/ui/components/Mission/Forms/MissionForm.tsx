import React, { useEffect, useState } from 'react'

import { useActionModalAndCollection } from '../../../core/hooks/useActionModalAndCollection'
import ModalLayout from '../../../core/layouts/modal_layout'
import LoadingModal from '../../../core/modal/LoadingModal'
import { AddableTable } from '../../Temp/AddableTable'

import ServiceForm from './ServiceForm'
import {
    serviceCrud,
    serviceNameConverter,
} from '../../../../domain/models/service/service'
import LocationForm from './LocationForm'
import {
    LocationCrud,
    LocationNameConverter,
} from '../../../../domain/models/location/location'
import {
    missionCrud,
    MissionSchema,
    TMission,
} from '../../../../domain/models/mission/mission'
import TextInput from '../../../alter/components/inputs/text_input'
import { getDefaults } from '../../../core/context/CustomFormContext'
import { modalService } from '../../../core/overlay/overlay_service'
import { get, getSummary } from '../../../../services/http'
import { useCollection } from '../../../core/hooks/useCollection'
import { ApiMissionAuthoritySchema, ApiMissionAuthoritySummaryType, ApiMissionAuthorityType, missionAuthorityCrud, MissionAuthoritySummaryFromToApi, MissionAuthoritySummaryNameConverter } from '../../../../domain/models/authority/mission_authority'
import { AuthorityForm } from './AuthorityForm'
import { OverlayModalConfig } from '../../../core/overlay/models/overlay_item'
import InfrastructureForm from './InfrastructureForm'
import { infrastructureCrud, infrastructureNameConverter } from '../../../../domain/models/infrastructure/infrastructure'
import VehicleForm from './VehicleForm'
import { vehicleCrud, vehicleNameConverter } from '../../../../domain/models/vehicle/vehicle_involved'
import PersonForm from './PersonForm'
import { personCrud, personNameConverter } from '../../../../domain/models/person/person_involved'

interface MissionFormProps {
    missionId: string
    missionCode: string
    initValue?: TMission
    onClose?: () => void
    closeOverlay?: () => void
}

const MissionForm = ({
    missionId,
    missionCode,
    onClose,
    initValue,
    closeOverlay,
}: MissionFormProps) => {
    const [loading, setLoading] = useState(false)
    const [alias, setAlias] = useState(initValue ? initValue.alias : '')

    const autoritiesCollection = useCollection(`mission/authority/summary/${missionId}`, MissionAuthoritySummaryFromToApi)

    const [serviceActions, services] = useActionModalAndCollection(
        ServiceForm,
        serviceCrud,
        { missionId: missionId },
        missionId
    )

    const [autorities, setAutorities] = useState<ApiMissionAuthoritySummaryType[]>([])

    const [locationActions, locations, setLocations] = useActionModalAndCollection(
        LocationForm,
        LocationCrud,
        { missionId: missionId },
        missionId
    )

    const [infrastructureActions, infrastructures] = useActionModalAndCollection(
        InfrastructureForm,
        infrastructureCrud,
        { missionId: missionId ?? '' },
        missionId ?? ''
    )
    const [vehicleActions, vehicles] = useActionModalAndCollection(
        VehicleForm,
        vehicleCrud,
        { missionId: missionId ?? '' },
        missionId ?? ''
    )
    const [personActions, people] = useActionModalAndCollection(
        PersonForm,
        personCrud,
        { missionId: missionId ?? '' },
        missionId ?? ''
    )

    const [innerServices, setInnerServices] = useState<any[]>()


    const getLocations = async () => {
        const result = await LocationCrud.getGroup(missionId)
        if (result.success && result.result) setLocations(result.result)
    }

    useEffect(() => {

        UpdateInnerServices()
        updateAuthoritiesData()
        getLocations()

    }, [services])





    useEffect(() => {
        updateAuthoritiesData()
    }, [])

    async function UpdateInnerServices() {
        const result = await getSummary<any>('mission/service')
        if (result.success && result.result) {
            const newInnerServices: any[] = []

            result.result.forEach(element => {
                if (element['id'] && services.filter(x => x.id == element['id']).length > 0) newInnerServices.push(element)
            });
            console.log(newInnerServices,);


            setInnerServices(newInnerServices.length == 0 ? [] : newInnerServices)
        }
    }

    async function updateService() {
        const missionResult = await missionCrud.getById(missionId)

        if (
            missionResult.success &&
            missionResult.result &&
            missionResult.result?.alias != alias
        ) {
            missionResult.result.alias = alias
            const updateResult = await missionCrud.update(missionResult.result)

            if (updateResult.success)
                modalService.toastSuccess('Misión actualizada!')
            else modalService.toastError('No se pudo actualizar la misión!')
        }
    }

    function updateAuthoritiesData() {
        async function update() {
            setLoading(true)

            const result = await get<ApiMissionAuthoritySummaryType[]>(`mission/authority/summary/${missionId}`)

            if (result.success && result.result) setAutorities(result.result)
            else setAutorities([])

            setLoading(false)
        }

        update();
    }

    async function addNewAuthority() {
        var errorMessage: string = ''
        try {
            setLoading(true)

            const newAuthority = getDefaults<ApiMissionAuthorityType>(ApiMissionAuthoritySchema)
            newAuthority.mission_id = missionId

            const authorityResult = await missionAuthorityCrud.insert(
                newAuthority
            )

            if (authorityResult.success && authorityResult.result?.id) {
                modalService.pushModal(
                    AuthorityForm,
                    {
                        initValue: authorityResult.result,
                        closeOverlay: undefined,
                    },
                    new OverlayModalConfig(),
                    updateAuthoritiesData
                )
            } else if (!authorityResult.success)
                errorMessage =
                    'Lo sentimos tenemos problemas para agregar la autoridad'
            else if (!authorityResult.result?.id) {
                errorMessage = 'El Id no fue retornado en el agregar la autoridad'
            }
        } catch (error) {
            errorMessage =
                'Lo sentimos ocurrio un error inesperado al agregar la autoridad'
            console.error(error)
        } finally {
            setLoading(false)
        }
        if (errorMessage != '') modalService.pushAlert('Error', errorMessage)
    }

    async function openAuthority(authority: any) {
        const result = await missionAuthorityCrud.getById(authority)

        if (result.success && result.result) {
            modalService.pushModal(
                AuthorityForm,
                {
                    initValue: result.result,
                    closeOverlay: undefined,
                },
                new OverlayModalConfig(),
                updateAuthoritiesData
            )
        } else {
            modalService.pushAlert(
                'Error',
                `No se pudo abrir la autoridad por: ${result.error}`
            )
        }
    }

    async function deleteAuthority(authority: any) {
        const result = await missionAuthorityCrud.remove(authority)

        if (result.success) {
            modalService.toastSuccess("Autoridad eliminada")
            updateAuthoritiesData()
        }
        else modalService.pushAlert(
            'Error',
            `No se pudo abrir la autoridad por: ${result.error}`
        )
    }


    return (
        <>
            <ModalLayout
                className="min-w-[70vw]"
                title={'Registro de la Misión'}
                onClose={closeOverlay}
            >
                <div className="flex justify-between w-full">
                    <div className="flex items-center space-x-4">
                        <div className="font-semibold text-slate-700 text-xl">
                            Alias:
                        </div>
                        <TextInput
                            value={alias}
                            onChange={(e) => setAlias(e.currentTarget.value)}
                            onBlur={updateService}
                        ></TextInput>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="font-semibold text-slate-700 text-xl">
                            Código:
                        </div>
                        <div className="bg-white px-4 py-2 rounded-md h-10">
                            {missionCode}
                        </div>
                    </div>
                </div>

                <div className="h-8"></div>

                <AddableTable
                    title="Servicios"
                    data={innerServices ?? []}
                    defaultSort={'id'}
                    idPropertyName="id"
                    addButtonText="Agregar un servicio"
                    nameConverter={serviceNameConverter}
                    onAddButtonClick={serviceActions.add}
                    onEditButtonClick={serviceActions.edit}
                    onDeleteButtonClick={serviceActions.delete}
                ></AddableTable>

                <div className="h-8"></div>

                <AddableTable
                    title="Ubicaciones"
                    data={locations}
                    defaultSort={'state'}
                    idPropertyName="id"
                    addButtonText="Agregar una ubicación"
                    nameConverter={LocationNameConverter}
                    onAddButtonClick={locationActions.add}
                    onEditButtonClick={locationActions.edit}
                    onDeleteButtonClick={locationActions.delete}
                ></AddableTable>

                <div className="h-8"></div>

                <AddableTable
                    title="Infraestructuras"
                    data={infrastructures}
                    idPropertyName="id"
                    addButtonText="Agregar una infraestructura"
                    nameConverter={infrastructureNameConverter}
                    onAddButtonClick={infrastructureActions.add}
                    onEditButtonClick={infrastructureActions.edit}
                    onDeleteButtonClick={
                        infrastructureActions.delete
                    }
                />

                <div className="h-8"></div>

                <AddableTable
                    title="Vehiculos"
                    data={vehicles}
                    idPropertyName="id"
                    addButtonText="Agregar un vehiculo"
                    nameConverter={vehicleNameConverter}
                    onAddButtonClick={vehicleActions.add}
                    onEditButtonClick={vehicleActions.edit}
                    onDeleteButtonClick={vehicleActions.delete}
                />

                <div className="h-8"></div>

                <AddableTable
                    title="Personas"
                    data={people}
                    idPropertyName="id"
                    addButtonText="Agregar una persona"
                    nameConverter={personNameConverter}
                    onAddButtonClick={personActions.add}
                    onEditButtonClick={personActions.edit}
                    onDeleteButtonClick={personActions.delete}
                />

                <AddableTable
                    title="Autoridades"
                    data={autorities}
                    defaultSort={'id'}
                    idPropertyName="id"
                    addButtonText="Agregar una autoridad"
                    nameConverter={MissionAuthoritySummaryNameConverter}
                    onAddButtonClick={addNewAuthority}
                    onEditButtonClick={openAuthority}
                    onDeleteButtonClick={deleteAuthority}
                ></AddableTable>



            </ModalLayout>
            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}

export default MissionForm
