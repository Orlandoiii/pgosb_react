import React, { useEffect, useState } from 'react'

import { useActionModalAndCollection } from '../../../core/hooks/useActionModalAndCollection'
import {
    useCollection,
    useSimpleCollection,
} from '../../../core/hooks/useCollection'

import ModalLayout from '../../../core/layouts/modal_layout'
import LoadingModal from '../../../core/modal/LoadingModal'
import { AddableTable } from '../../Temp/AddableTable'
import Button from '../../../core/buttons/Button'
import {
    serviceCrud,
    ServiceSchema,
    TService,
} from '../../../../domain/models/service/service'
import { getDefaults } from '../../../core/context/CustomFormContext'
import { AntaresFromApi } from '../../../../domain/models/antares/antares'

import InfrastructureForm from './InfrastructureForm'
import {
    infrastructureCrud,
    infrastructureNameConverter,
} from '../../../../domain/models/infrastructure/infrastructure'

import VehicleForm from './VehicleForm'
import {
    vehicleCrud,
    vehicleNameConverter,
} from '../../../../domain/models/vehicle/vehicle_involved'

import PersonForm from './PersonForm'
import {
    personCrud,
    personNameConverter,
} from '../../../../domain/models/person/person_involved'
import { ResultErr } from '../../../../domain/abstractions/types/resulterr'
import AlertController from '../../../core/alerts/AlertController'
import { UserSimple } from '../../../../domain/models/user/user'
import TextArea from '../../../core/inputs/TextArea'
import { UnitSimple } from '../../../../domain/models/unit/unit'
import LocationIcon from '../../../core/icons/LocationIcon'
import { get } from '../../../../services/http'
import { SelectWithSearch } from '../../../alter/components/inputs/select_with_search'
import { EnumToStringArray } from '../../../../utilities/converters/enum_converter'
import { Roles } from '../../../../domain/abstractions/enums/roles'

const alertController = new AlertController()

interface ServiceFormProps {
    missionId: string
    initValue?: TService
    closeOverlay?: () => void
}

const ServiceForm = ({
    missionId,
    initValue,
    closeOverlay,
}: ServiceFormProps) => {
    const antaresCollection = useCollection('mission/antares', AntaresFromApi)
    const usersCollection: UserSimple[] = useSimpleCollection('user')
    const unitsCollection: UnitSimple[] = useSimpleCollection('unit')

    const [unit, setUnit] = useState('')
    const [firefighter, setFirefighter] = useState('')
    const [firefighterRol, setFirefighterRol] = useState('')

    const [serviceUsers, setServiceUsers] = useState<UserSimple[]>([])
    const [serviceUnits, setServiceUnits] = useState<UnitSimple[]>([])

    const [serviceId, setServiceId] = useState(initValue ? initValue.id : '-1')

    const [infrastructureActions, infrastructures] =
        useActionModalAndCollection(
            InfrastructureForm,
            infrastructureCrud,
            { serviceId: serviceId },
            serviceId
        )
    const [vehicleActions, vehicles] = useActionModalAndCollection(
        VehicleForm,
        vehicleCrud,
        { serviceId: serviceId },
        serviceId
    )
    const [personActions, people] = useActionModalAndCollection(
        PersonForm,
        personCrud,
        { serviceId: serviceId },
        serviceId
    )

    const [loading, setLoading] = useState(false)
    const [antares, setAntares] = useState('')
    const [savedAntares, setSavedAntares] = useState('')
    const [setIt, setSetIt] = useState(false)
    const [details, setDetails] = useState(
        initValue ? initValue.description : ''
    )

    const [savedDetails, setSavedDetails] = useState(
        initValue ? initValue.description : ''
    )

    const [ubicationSaved, setUbicationSaved] = useState(false)
    const roles = EnumToStringArray(Roles)

    console.log('antares', antares)

    useEffect(() => {
        if (!setIt && initValue && antaresCollection.length > 0) {
            const description = antaresCollection.filter(
                (item) => item.id == initValue.antaresId
            )[0]
            setSavedAntares(`${description.id} - ${description.description}`)
            setAntares(`${description.id} - ${description.description}`)
            setSetIt(true)

            updateUnits()
            updateUsers()
        }
    }, [antaresCollection])

    async function updateUnits() {
        const result = await get<UnitSimple[]>(
            `mission/service/unit/${serviceId}`
        )
        if (result.success && result.result) setServiceUnits(result.result)
        console.log(result)
    }

    async function updateUsers() {
        const result = await get<UserSimple[]>(
            `mission/service/user/${serviceId}`
        )
        if (result.success && result.result) setServiceUsers(result.result)
        console.log(result)
    }

    function AntaresBlurHandler() {
        const selectedAntares = antaresCollection.filter(
            (item) => item.description === antares
        )[0]
        console.log('blur', antares)

        if (selectedAntares) {
            if (savedAntares != '') return
            safeOrUpdateService(selectedAntares.id)
        } else setAntares('')
    }

    function antaresButtonClicked() {
        safeOrUpdateService(antares.split(' - ')[0])
    }

    async function safeOrUpdateService(antaresId: string) {
        if (antares === '') return
        const add = serviceId === '-1'

        var errorMessage: string = ''
        try {
            setLoading(true)
            var resultService: ResultErr<TService>
            if (add) {
                const defaultValue = getDefaults<TService>(ServiceSchema)
                defaultValue.missionId = missionId
                defaultValue.antaresId = antaresId

                resultService = await serviceCrud.insert(defaultValue)
            } else {
                const service = await serviceCrud.getById(serviceId)

                if (service.success && service.result) {
                    service.result.antaresId = antaresId

                    resultService = await serviceCrud.update(service.result)
                }
            }
            if (resultService! && resultService.success) {
                alertController.notifySuccess(
                    add ? 'Servicio guardado' : 'Servicio actualizado'
                )

                setServiceId(resultService.result?.id)
                setSavedAntares(antares)
                return
            } else if (!resultService!.success)
                errorMessage = `Lo sentimos tenemos problemas para ${add ? 'agregar' : 'guardar'} el servicio`
            else if (add && !resultService!.result?.id)
                errorMessage =
                    'El Id no fue retornado en el agregar el servicio'
        } catch (error) {
            errorMessage = `Lo sentimos ocurrio un error inesperado al ${add ? 'agregar' : 'guardar'} la misión`
            console.error(error)
        } finally {
            setLoading(false)
        }
        if (errorMessage != '') alertController.notifyError(errorMessage)
    }

    function formIsEnable(): boolean {
        return savedAntares != '' && antares === savedAntares
    }

    async function updateServiceDetails() {
        if (details == savedDetails) return

        const service = await serviceCrud.getById(serviceId)

        if (service.success && service.result) {
            service.result.description = details

            const resultService = await serviceCrud.update(service.result)
            if (resultService.success) setSavedDetails(details)
        }
    }

    async function addUnitHandler(unit: string, ignore: any) {
        const selected = unitsCollection.filter(
            (items) => items.plate === unit
        )[0]

        const service = await serviceCrud.getById(serviceId)

        if (service.success && service.result) {
            service.result.units.push(selected.id)

            const resultService = await serviceCrud.update(service.result)
            if (resultService.success) {
                alertController.notifySuccess('Unidad guardada')
                updateUnits()
            }
        }
    }

    async function addUserHandler(unit: string, rol: string) {
        const selected = usersCollection.filter(
            (items) => items.user_name === unit
        )[0]

        const service = await serviceCrud.getById(serviceId)

        if (service.success && service.result) {
            service.result.firefighter.push(selected.id)

            const resultService = await serviceCrud.update(service.result)
            if (resultService.success) {
                alertController.notifySuccess('Usuario guardada')
                updateUsers()
            }
        }
    }

    const antaresNames = antaresCollection.map(
        (item) => `${item.id} - ${item.description}`
    )

    return (
        <>
            <ModalLayout
                className="max-h-[90vh] min-w-[70vw] max-w-[85vw]"
                title={'Registro de Datos del Servicio'}
                onClose={closeOverlay}
            >
                <div className="flex space-x-4 w-full">
                    <SelectWithSearch
                        description="Antares"
                        options={antaresNames}
                        selectedOption={antares}
                        selectionChange={(e) => setAntares(e)}
                    />

                    <div className="mt-8 h-11 mb-2.5">
                        <Button
                            enable={antares != '' && antares != savedAntares}
                            colorType="bg-[#3C50E0]"
                            onClick={antaresButtonClicked}
                            children={'Guardar'}
                        ></Button>
                    </div>
                </div>

                <div className="flex space-x-6 w-full pt-4">
                    <div className="w-full">
                        <div className="space-y-10 w-full">
                            <AddableTable
                                enable={formIsEnable()}
                                title="Unidades"
                                data={serviceUnits}
                                optionsDescription={'Placa'}
                                options={unitsCollection.map(
                                    (item) => item.plate
                                )}
                                onAddOption={addUnitHandler}
                                idPropertyName="id"
                                addButtonText="Agregar una unidad"
                            ></AddableTable>

                            <AddableTable
                                enable={formIsEnable()}
                                title="Bomberos"
                                data={serviceUsers}
                                optionsDescription={'Usuario'}
                                options={usersCollection.map(
                                    (item) => item.user_name
                                )}
                                optionsDescription2={'Rol'}
                                options2={roles}
                                onAddOption={addUserHandler}
                                defaultSort={'id'}
                                idPropertyName="id"
                                addButtonText="Agregar un bombero"
                            />

                            <AddableTable
                                enable={formIsEnable()}
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

                            <AddableTable
                                enable={formIsEnable()}
                                title="Vehiculos"
                                data={vehicles}
                                idPropertyName="id"
                                addButtonText="Agregar un vehiculo"
                                nameConverter={vehicleNameConverter}
                                onAddButtonClick={vehicleActions.add}
                                onEditButtonClick={vehicleActions.edit}
                                onDeleteButtonClick={vehicleActions.delete}
                            />

                            <AddableTable
                                enable={formIsEnable()}
                                title="Personas"
                                data={people}
                                idPropertyName="id"
                                addButtonText="Agregar una persona"
                                nameConverter={personNameConverter}
                                onAddButtonClick={personActions.add}
                                onEditButtonClick={personActions.edit}
                                onDeleteButtonClick={personActions.delete}
                            />
                        </div>
                    </div>

                    <div
                        className={`w-1/2 space-y-4 pb-8 ${formIsEnable() ? '' : 'pointer-events-none opacity-50 select-none'}`}
                    >
                        <span className="text-xl font-semibold text-slate-700">
                            Descripción / Bitacora
                        </span>
                        <TextArea
                            tabIndex={formIsEnable() ? undefined : -1}
                            disabled={!formIsEnable()}
                            inputName="description"
                            value={details}
                            onBlur={updateServiceDetails}
                            onChange={(e) => setDetails(e.currentTarget.value)}
                        />
                    </div>
                </div>
            </ModalLayout>

            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}
export default ServiceForm
