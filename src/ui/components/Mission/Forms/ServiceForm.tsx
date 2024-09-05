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
    serviceNameConverter,
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
import {
    userNameConverter,
    UserSimple,
} from '../../../../domain/models/user/user'
import TextArea from '../../../core/inputs/TextArea'
import {
    unitNameConverter,
    UnitSimple,
} from '../../../../domain/models/unit/unit'
import LocationIcon from '../../../core/icons/LocationIcon'
import { get, post } from '../../../../services/http'
import { SelectWithSearch } from '../../../alter/components/inputs/select_with_search'
import { EnumToStringArray } from '../../../../utilities/converters/enum_converter'
import { Roles } from '../../../../domain/abstractions/enums/roles'
import TextInput from '../../../alter/components/inputs/text_input'
import LocationForm from './LocationForm'
import { LocationCrud } from '../../../../domain/models/location/location'
import { formatDateTime } from '../../../../utilities/formatters/date_formatter'
import Toggle from '../../../alter/components/buttons/toggle'
import _ from 'lodash'
import Chip from '../../../alter/components/data_presenters/chip'
import { modalService } from '../../../core/overlay/overlay_service'

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
    const [serviceId, setServiceId] = useState(initValue ? initValue.id : '-1')

    const antaresCollection = useCollection('mission/antares', AntaresFromApi)
    const stationCollection = useCollection('station', (data: any) => {
        return { success: true, result: data }
    })
    const careCenterCollection = useCollection('center', (data: any) => {
        return { success: true, result: data }
    })

    const [date, setDate] = useState(
        initValue ? initValue.manualServiceDate : formatDateTime(new Date())
    )

    const [isImportant, setIsImportant] = useState<boolean>(
        initValue ? initValue.isImportant : false
    )

    const [operativeAreas, setOperativeAreas] = useState<string[]>()

    const [locationActions, locations] = useActionModalAndCollection(
        LocationForm,
        LocationCrud,
        { missionId: missionId },
        missionId
    )

    const [infrastructureActions, infrastructures] =
        useActionModalAndCollection(
            InfrastructureForm,
            infrastructureCrud,
            { serviceId: serviceId ?? '' },
            serviceId ?? ''
        )
    const [vehicleActions, vehicles] = useActionModalAndCollection(
        VehicleForm,
        vehicleCrud,
        { serviceId: serviceId ?? '' },
        serviceId ?? ''
    )
    const [personActions, people] = useActionModalAndCollection(
        PersonForm,
        personCrud,
        { serviceId: serviceId ?? '' },
        serviceId ?? ''
    )

    const usersCollection: UserSimple[] = useSimpleCollection('user')
    const unitsCollection: UnitSimple[] = useSimpleCollection('unit')

    const [unharmed, setUnharmed] = useState(
        initValue ? initValue.unharmed : ''
    )
    const [injured, setInjured] = useState(initValue ? initValue.injured : '')
    const [transferred, setTransferred] = useState(
        initValue ? initValue.transported : ''
    )
    const [deceased, setDeceased] = useState(
        initValue ? initValue.deceased : ''
    )

    const [serviceUsers, setServiceUsers] = useState<UserSimple[]>([])
    const [serviceUnits, setServiceUnits] = useState<UnitSimple[]>([])

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
    const [station, setStation] = useState('')
    const [serviceLocation, setServiceLocation] = useState('')
    const [careCenter, setCareCenter] = useState('')

    const roles = EnumToStringArray(Roles)

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

    useEffect(() => {
        if (initValue && stationCollection && stationCollection.length > 0) {
            const x = stationCollection.filter(
                (x) => x.id == initValue!.stationId
            )[0]
            setStation(`${x.abbreviation} - ${x.name}`)
        }
    }, [stationCollection])

    useEffect(() => {
        if (
            initValue &&
            initValue.locationId != '' &&
            initValue.locationId != '0' &&
            locations &&
            locations.length > 0
        ) {
            const x = locations.filter((x) => x.id == initValue!.locationId)[0]
            setServiceLocation(`${x.id} - ${x.alias}`)
        }
    }, [locations])

    useEffect(() => {
        if (
            initValue &&
            initValue.centerId != '' &&
            initValue.centerId != '0' &&
            careCenterCollection &&
            careCenterCollection.length > 0
        ) {
            const x = careCenterCollection.filter(
                (x) => x.id == initValue!.centerId
            )[0]
            console.log('CareCenter', x, initValue.centerId)

            setCareCenter(`${x.id} - ${x.name}`)
        }
    }, [careCenterCollection])

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

    const [count, setCount] = useState(0)

    let debounceUpdate = _.debounce(function () {
        setCount(count + 1)
    }, 1000)

    useEffect(() => {
        console.log('aksdjklasjdklsajdkl', antares, station)

        if (antares != '' && station != '') antaresButtonClicked()
    }, [count])

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

                defaultValue.unharmed = unharmed
                defaultValue.injured = injured
                defaultValue.transported = transferred
                defaultValue.deceased = deceased
                defaultValue.description = details
                defaultValue.manualServiceDate = date
                defaultValue.isImportant = isImportant
                defaultValue.operativeAreas = operativeAreas

                if (
                    stationCollection &&
                    stationCollection.length > 0 &&
                    station
                )
                    defaultValue.stationId = stationCollection.filter(
                        (x) => `${x.abbreviation} - ${x.name}` == station
                    )[0].id
                if (
                    careCenterCollection &&
                    careCenterCollection.length > 0 &&
                    careCenter
                )
                    defaultValue.centerId = careCenterCollection.filter(
                        (x) => `${x.id} - ${x.name}` == careCenter
                    )[0].id

                if (locations && locations.length > 0 && serviceLocation)
                    defaultValue.locationId =
                        locations.filter(
                            (x) => `${x.id} - ${x.alias}` == serviceLocation
                        )[0].id ?? '0'

                resultService = await serviceCrud.insert(defaultValue)
            } else {
                const service = await serviceCrud.getById(serviceId ?? '')

                if (service.success && service.result) {
                    service.result.antaresId = antaresId

                    service.result.unharmed = unharmed
                    service.result.injured = injured
                    service.result.transported = transferred
                    service.result.deceased = deceased
                    service.result.description = details

                    service.result.manualServiceDate = date
                    service.result.isImportant = isImportant
                    service.result.operativeAreas = operativeAreas

                    if (
                        stationCollection &&
                        stationCollection.length > 0 &&
                        station
                    )
                        service.result.stationId = stationCollection.filter(
                            (x) => `${x.abbreviation} - ${x.name}` == station
                        )[0].id
                    if (
                        careCenterCollection &&
                        careCenterCollection.length > 0 &&
                        careCenter
                    )
                        service.result.centerId = careCenterCollection.filter(
                            (x) => `${x.id} - ${x.name}` == careCenter
                        )[0].id

                    if (locations && locations.length > 0 && serviceLocation)
                        service.result.locationId =
                            locations.filter(
                                (x) => `${x.id} - ${x.alias}` == serviceLocation
                            )[0].id ?? '0'

                    resultService = await serviceCrud.update(service.result)
                }
            }
            if (resultService! && resultService.success) {
                alertController.notifySuccess(
                    add ? 'Servicio guardado' : 'Servicio actualizado'
                )

                if (add) setServiceId(resultService.result?.id)
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

    console.log('Saved', savedAntares, antares)

    async function addUnitHandler(unit: string, ignore: any) {
        const selected = unitsCollection.filter(
            (item) => `${item.plate} - ${item.unit_type}` === unit
        )[0]

        const service = await serviceCrud.getById(serviceId ?? '')

        if (service.success && service.result && service.result.units) {
            service.result.units.push(selected.id)

            const resultService = await serviceCrud.update(service.result)
            if (resultService.success) {
                alertController.notifySuccess('Unidad guardada')
                updateUnits()
            }
        }
    }

    async function deleteUnitHandler(unit: string) {
        const service = await serviceCrud.getById(serviceId ?? '')

        if (service.success && service.result && service.result.units) {
            service.result.units = service.result.units.filter((x) => x != unit)

            const resultService = await serviceCrud.update(service.result)
            if (resultService.success) {
                alertController.notifySuccess('Unidad eliminada')
                updateUnits()
            }
        }
    }

    async function addUserHandler(unit: string, rol: string) {
        const selected = usersCollection.filter(
            (items) => items.personal_code === unit.split(' - ')[0]
        )[0]

        const service = await post('mission/firefighter/create', {
            mission_id: missionId,
            service_id: serviceId,
            user_id: selected.id,
            service_role: rol,
        })

        if (service.success) modalService.toastSuccess('Bombero guardado!')
        else
            modalService.toastError(
                'Ocurrió un error al intentar guardar el bombero!'
            )
    }

    async function deleteUserHandler(unit: string) {
        const service = await serviceCrud.getById(serviceId ?? '')

        if (service.success && service.result && service.result.firefighter) {
            service.result.firefighter = service.result.firefighter.filter(
                (x) => x != unit
            )

            const resultService = await serviceCrud.update(service.result)
            if (resultService.success) {
                alertController.notifySuccess('Usuario eliminado')
                updateUsers()
            }
        }
    }

    const antaresNames = antaresCollection.map(
        (item) => `${item.id} - ${item.description}`
    )

    function addOperativeArea(operativeArea: string) {
        if (!operativeAreas) {
            setOperativeAreas([operativeArea])
            return
        }

        let newOperativeAreas: string[] = [...operativeAreas, operativeArea]
        newOperativeAreas = [
            ...newOperativeAreas.filter(
                (value, index) => newOperativeAreas.indexOf(value) === index
            ),
        ]

        setOperativeAreas(newOperativeAreas)
        debounceUpdate()
    }

    function removeOperativeArea(operativeArea: string) {
        if (!operativeAreas) return

        let newOperativeAreas: string[] = []

        operativeAreas.forEach((element) => {
            if (element != operativeArea) newOperativeAreas.push(element)
        })

        setOperativeAreas(newOperativeAreas)
        debounceUpdate()
    }

    return (
        <>
            <ModalLayout
                className="min-w-[80vw] max-w-[85vw] max-h-[90vh] overflow-y-auto"
                title={'Registro de Datos del Servicio'}
                onClose={closeOverlay}
            >
                <div className="flex items-center space-x-8 xl:space-x-6 w-full">
                    <div className="w-full">
                        <div className="flex space-x-4 w-full">
                            <div className="flex-auto w-64">
                                <SelectWithSearch
                                    description="Antares"
                                    options={antaresNames}
                                    selectedOption={antares}
                                    selectionChange={(e) => {
                                        setAntares(e)
                                        debounceUpdate()
                                    }}
                                />
                            </div>

                            <div className="flex flex-auto space-x-1 w-24">
                                <SelectWithSearch
                                    description="Ubicación del servicio"
                                    options={locations.map(
                                        (x) => `${x.id} - ${x.alias}`
                                    )}
                                    selectedOption={serviceLocation}
                                    selectionChange={(e) => {
                                        setServiceLocation(e)
                                        debounceUpdate()
                                    }}
                                />

                                <div className="flex-none pt-8 h-11">
                                    <Button
                                        colorType="bg-[#3C50E0]"
                                        onClick={locationActions.add}
                                        children={'+'}
                                        width="w-10"
                                    ></Button>
                                </div>
                            </div>
                            <div className="flex pt-8">
                                <Toggle
                                    width="w-44"
                                    height="h-11"
                                    toggle={isImportant}
                                    option1="Importante"
                                    option2="No importante"
                                    toggleChanged={() => {
                                        setIsImportant(!isImportant)
                                        debounceUpdate()
                                    }}
                                ></Toggle>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-auto w-64">
                                <SelectWithSearch
                                    description="Estación"
                                    options={stationCollection.map(
                                        (x) => `${x.abbreviation} - ${x.name}`
                                    )}
                                    selectedOption={station}
                                    selectionChange={(e) => {
                                        setStation(e)
                                        debounceUpdate()
                                    }}
                                />
                            </div>

                            <div className="flex-auto w-24">
                                <SelectWithSearch
                                    description="Centro asistencial"
                                    options={careCenterCollection.map(
                                        (x) => `${x.id} - ${x.name}`
                                    )}
                                    selectedOption={careCenter}
                                    selectionChange={(e) => {
                                        setCareCenter(e)
                                        debounceUpdate()
                                    }}
                                />
                            </div>

                            <div className="flex-auto w-24">
                                <TextInput
                                    description="Fecha de servicio"
                                    value={date}
                                    onChange={(e) =>
                                        setDate(e.currentTarget.value)
                                    }
                                    onBlur={() => debounceUpdate()}
                                ></TextInput>
                            </div>
                        </div>
                    </div>
                    {/* <div className="flex-none mt-8 mb-2.5 h-11">
                        <Button
                            enable={antares != '' && station != ''}
                            colorType="bg-[#3C50E0]"
                            onClick={antaresButtonClicked}
                            children={'Guardar'}
                        ></Button>
                    </div> */}
                </div>

                <div className="h-8"></div>

                <div className="flex items-center space-x-6">
                    <div className="w-64">
                        <SelectWithSearch
                            description="Áreas operativas"
                            options={stationCollection.map(
                                (x) => `${x.abbreviation} - ${x.name}`
                            )}
                            selectedOption={''}
                            selectionChange={(e) => {
                                addOperativeArea(e)
                            }}
                        />
                    </div>

                    {operativeAreas && (
                        <div className="w-full">
                            {operativeAreas.map((item) => (
                                <Chip
                                    text={item}
                                    onDelete={removeOperativeArea}
                                ></Chip>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-8"></div>

                <div className="flex space-x-6 pt-4 w-full">
                    <div className="w-full">
                        <div className="space-y-10 w-full">
                            <AddableTable
                                enable={formIsEnable()}
                                title="Unidades"
                                data={serviceUnits}
                                optionsDescription={'Placa'}
                                options={unitsCollection.map(
                                    (item) =>
                                        `${item.plate} - ${item.unit_type}`
                                )}
                                nameConverter={unitNameConverter}
                                onAddOption={addUnitHandler}
                                onDeleteButtonClick={deleteUnitHandler}
                                idPropertyName="id"
                                addButtonText="Agregar una unidad"
                            ></AddableTable>

                            <AddableTable
                                enable={formIsEnable()}
                                title="Bomberos"
                                data={serviceUsers}
                                optionsDescription={'Usuario'}
                                nameConverter={userNameConverter}
                                options={usersCollection.map(
                                    (item) =>
                                        `${item.personal_code} - ${item.legal_id}`
                                )}
                                optionsDescription2={'Rol'}
                                options2={roles}
                                onAddOption={addUserHandler}
                                onDeleteButtonClick={deleteUserHandler}
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
                        className={`flex flex-col w-1/2 space-y-4  ${formIsEnable() ? '' : 'pointer-events-none opacity-50 select-none'}`}
                    >
                        <div className="space-y-4 w-full">
                            <span className="font-semibold text-slate-700 text-xl">
                                Personas sin documetación
                            </span>

                            <div className="w-full">
                                <div className="flex items-center space-x-4">
                                    <TextInput
                                        type={'Integer'}
                                        description={'Ilesos'}
                                        value={unharmed}
                                        onChange={(e) =>
                                            setUnharmed(e.currentTarget.value)
                                        }
                                        onBlur={() => debounceUpdate()}
                                    ></TextInput>
                                    <TextInput
                                        type={'Integer'}
                                        description={'Lesionados'}
                                        value={injured}
                                        onChange={(e) =>
                                            setInjured(e.currentTarget.value)
                                        }
                                        onBlur={() => debounceUpdate()}
                                    ></TextInput>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <TextInput
                                        type={'Integer'}
                                        description={'Trasladados'}
                                        value={transferred}
                                        onChange={(e) =>
                                            setTransferred(
                                                e.currentTarget.value
                                            )
                                        }
                                        onBlur={() => debounceUpdate()}
                                    ></TextInput>
                                    <TextInput
                                        type={'Integer'}
                                        description={'Fallecidos'}
                                        value={deceased}
                                        onChange={(e) =>
                                            setDeceased(e.currentTarget.value)
                                        }
                                        onBlur={() => debounceUpdate()}
                                    ></TextInput>
                                </div>
                            </div>
                        </div>

                        <span className="font-semibold text-slate-700 text-xl">
                            Descripción / Bitacora
                        </span>

                        <TextArea
                            tabIndex={formIsEnable() ? undefined : -1}
                            disabled={!formIsEnable()}
                            inputName="description"
                            value={details}
                            onChange={(e) => setDetails(e.currentTarget.value)}
                            onBlur={() => debounceUpdate()}
                        />
                    </div>
                </div>
            </ModalLayout>

            <LoadingModal initOpen={loading} children={null} />
        </>
    )
}
export default ServiceForm
